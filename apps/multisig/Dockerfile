FROM node:18-alpine as base

ARG HASURA_ENDPOINT
ARG SIWS_ENDPOINT
ARG NETWORKS

ENV REACT_APP_APPLICATION_NAME=Signet \
    REACT_APP_HASURA_ENDPOINT=$HASURA_ENDPOINT \
    REACT_APP_CONTACT_EMAIL=signet@talisman.xyz \
    REACT_APP_SIWS_ENDPOINT=$SIWS_ENDPOINT \
    REACT_APP_NETWORKS=$NETWORKS

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
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]