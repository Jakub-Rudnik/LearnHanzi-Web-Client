FROM node:24-slim

RUN corepack enable pnpm
ENV PNPM_STORE_DIR=/app/.pnpm-store

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN chown -R node:node /app
USER node
RUN pnpm config set store-dir "$PNPM_STORE_DIR" && pnpm install

COPY --chown=node:node . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]