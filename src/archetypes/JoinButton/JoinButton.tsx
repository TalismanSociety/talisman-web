import { Button } from '@components'
import { DISCORD_JOIN_URL } from '@util/links'

export const JoinButton = ({ className = '' }) => {
  return (
    <a href={DISCORD_JOIN_URL} target="_blank" rel="noreferrer noopener">
      <Button className={className}>Join Discord</Button>
    </a>
  )
}
