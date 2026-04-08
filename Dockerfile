FROM node:24-slim

RUN corepack enable pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN chown -R node:node /app

USER node

EXPOSE 5173

CMD ["pnpm", "run", "dev"]