# syntax=docker/dockerfile:1.6
FROM node:20-slim AS base
WORKDIR /app
ENV PNPM_HOME="/usr/local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps/hub-web/package.json ./apps/hub-web/
RUN pnpm install --filter @aza8/hub-web...

FROM deps AS build
COPY . .
RUN pnpm turbo run build --filter=@aza8/hub-web...

FROM node:20-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/hub-web/.next/standalone ./
COPY --from=build /app/apps/hub-web/.next/static ./.next/static
COPY --from=build /app/apps/hub-web/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
