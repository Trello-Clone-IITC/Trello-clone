# syntax=docker/dockerfile:1.7-labs

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# use a BuildKit secret so the token never lands in an image layer
RUN --mount=type=secret,id=GH_PACKAGES_TOKEN \
    printf "@ronmordo:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\nalways-auth=true\n" \
      "$(cat /run/secrets/GH_PACKAGES_TOKEN)" > .npmrc \
 && npm ci \
 && rm -f .npmrc

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist dist
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node","dist/server.js"]
