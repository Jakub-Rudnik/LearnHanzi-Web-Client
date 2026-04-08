# LearnHanzi Web Client

Official web client for [LearnHanzi](https://github.com/Jakub-Rudnik/LearnHanzi-Server), a tool for learning Chinese characters.


## Run development version
### Docker / Podman - recommended way
```bash
docker compose build
docker compose up -d

#if you're using podman
podman compose build
podman compose up -d
```

You can also run it locally but that requires having node and pnpm installed
```bash
pnpm install
pnpm run dev
```

## Run production version
TBA

## To install any package and save it to the dependencies, use:
```bash
docker compose exec learn-hanzi-client pnpm add <package-name>
```