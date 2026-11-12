FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# Install dependencies
FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# Database migration runner
FROM base AS migrator

COPY --from=deps /app/node_modules ./node_modules
COPY prisma ./prisma
COPY prisma.config.ts ./

CMD ["npx", "prisma", "migrate", "deploy"]

# Production image
FROM base AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN mkdir -p /app/recipe-uploads

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]