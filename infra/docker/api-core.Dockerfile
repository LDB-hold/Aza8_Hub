# syntax=docker/dockerfile:1.6
FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/api-core/package.json ./apps/api-core/
RUN pnpm install --filter @aza8/api-core...

FROM deps AS build
COPY . .
RUN pnpm turbo run build --filter=@aza8/api-core...

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api-core/dist ./dist
COPY apps/api-core/package.json ./package.json
CMD ["node", "dist/main.js"]
