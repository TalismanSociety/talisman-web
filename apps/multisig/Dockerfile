FROM node:18-alpine as base

FROM base as builder
RUN apk add --no-cache libc6-compat
RUN apk update

# setup working dir
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune @talismn/multisig --docker

RUN yarn install
RUN yarn turbo run build --filter=@talismn/multisig...

# Use Nginx as the production server
FROM nginx:alpine

# Copy the built React app to Nginx's web server directory
COPY --from=builder /app/apps/multisig/build /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]