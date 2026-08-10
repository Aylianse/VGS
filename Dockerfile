# syntax=docker/dockerfile:1

FROM node:22-slim AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_EMAIL
ARG NEXT_PUBLIC_PHONE
ARG NEXT_PUBLIC_PHONE_DISPLAY
ARG NEXT_PUBLIC_WHATSAPP
ARG NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_EMAIL=$NEXT_PUBLIC_EMAIL
ENV NEXT_PUBLIC_PHONE=$NEXT_PUBLIC_PHONE
ENV NEXT_PUBLIC_PHONE_DISPLAY=$NEXT_PUBLIC_PHONE_DISPLAY
ENV NEXT_PUBLIC_WHATSAPP=$NEXT_PUBLIC_WHATSAPP
ENV NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=$NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

RUN mkdir -p public/uploads/products public/uploads/blog public/uploads/general \
  && chown -R nextjs:nodejs public/uploads

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
