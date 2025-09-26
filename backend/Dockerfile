# syntax=docker/dockerfile:1.7-labs

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./

# Auth to GitHub Packages via BuildKit secret (token never lands in layers)
RUN --mount=type=secret,id=GH_PACKAGES_TOKEN \
    sh -c 'TOKEN="$(cat /run/secrets/GH_PACKAGES_TOKEN)"; \
           printf "@ronmordo:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$TOKEN" > .npmrc; \
           npm ci'



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
