# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy root workspace configurations
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source code
COPY packages/shared/ ./packages/shared/
COPY apps/api/ ./apps/api/

# Build shared and api packages
RUN npm run build --workspace=packages/shared
RUN npm run build --workspace=apps/api

# Production runner stage
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY apps/api/package*.json ./apps/api/

RUN npm ci --omit=dev

COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma

EXPOSE 8080

USER node

CMD ["node", "apps/api/dist/server.js"]
