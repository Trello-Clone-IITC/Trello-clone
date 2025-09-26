# syntax=docker/dockerfile:1.7-labs

# --- deps: install all deps with GH Packages auth ---
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package*.json ./
RUN --mount=type=secret,id=GH_PACKAGES_TOKEN \
    sh -c 'TOKEN="$(cat /run/secrets/GH_PACKAGES_TOKEN)"; \
           printf "@ronmordo:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$TOKEN" > .npmrc; \
           npm ci; \
           rm -f .npmrc'

# --- build: copy source, generate Prisma Client, build TS ---
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules node_modules
COPY . .
# prisma generate (needs schema in repo)
ENV DATABASE_URL=postgresql://user:pass@localhost:5432/db
RUN npx prisma generate
RUN npm run build

# --- prod-deps: only production deps ---
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- runtime: prod deps + generated client + built JS ---
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node","dist/server.js"]
