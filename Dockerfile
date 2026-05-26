FROM node:24-slim

RUN corepack enable pnpm && corepack prepare pnpm@10.33.0 --activate
ENV PNPM_STORE_DIR=/pnpm/store

WORKDIR /app

RUN mkdir -p "$PNPM_STORE_DIR"

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN chown -R node:node /app /pnpm
USER node
RUN pnpm config set store-dir "$PNPM_STORE_DIR" && pnpm install --frozen-lockfile

COPY --chown=node:node . .
RUN pnpm run build

EXPOSE 4173

CMD ["pnpm", "run", "preview"]