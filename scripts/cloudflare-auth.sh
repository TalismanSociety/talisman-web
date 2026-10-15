#!/usr/bin/env bash
set -euo pipefail

account_id=5c3dd225e748d81d16347cd473f450b2
worker=talisman-portal
env_file="${CLOUDFLARE_ENV_FILE:-$HOME/.talisman-dev/cloudflare.env}"
api=https://api.cloudflare.com/client/v4

cat <<EOF
Open this URL in the browser you use for Cloudflare:

  https://dash.cloudflare.com/profile/api-tokens

Create Token > Create Custom Token, then set:
  Token name:  ${worker} read-only
  Permissions:
    Account | Workers Builds Configuration | Read
    Account | Workers Scripts              | Read
    Account | Account Settings             | Read
  Account Resources: Include | the account ${account_id}

EOF

read -rsp "Paste the token: " token
echo

get() {
  curl -sS -o /dev/null -w '%{http_code}' -H "Authorization: Bearer ${token}" "${api}$1"
}

json() {
  curl -fsS -H "Authorization: Bearer ${token}" "${api}$1"
}

check() {
  local status
  status=$(get "$2")
  if [ "$status" = 200 ]; then
    echo "ok    $1"
  else
    echo "FAIL  $1 (HTTP ${status})"
    return 1
  fi
}

check "token is active" /user/tokens/verify
check "Account Settings: Read" "/accounts/${account_id}"
check "Workers Scripts: Read" "/accounts/${account_id}/workers/scripts/${worker}/settings"

tag=$(json "/accounts/${account_id}/workers/scripts" | node -e '
  let raw = ""
  process.stdin.on("data", (chunk) => (raw += chunk)).on("end", () => {
    const script = JSON.parse(raw).result.find(({ id }) => id === process.argv[1])
    process.stdout.write(script?.tag ?? "")
  })
' "$worker")
[ -n "$tag" ] || { echo "FAIL  Worker ${worker} not found in account ${account_id}"; exit 1; }
check "Workers Builds Configuration: Read" "/accounts/${account_id}/builds/workers/${tag}/builds"

mkdir -p "$(dirname "$env_file")"
umask 077
printf 'CLOUDFLARE_API_TOKEN=%s\nCLOUDFLARE_ACCOUNT_ID=%s\n' "$token" "$account_id" > "$env_file"
echo "Saved to ${env_file}"
