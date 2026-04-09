# LearnHanzi Web Client

Official web client for [LearnHanzi](https://github.com/Jakub-Rudnik/LearnHanzi-Server), a tool for learning Chinese characters.

## Run development version
### Docker / Podman - recommended way (LINUX)
```bash
make build
make up
make up
```

`make` auto-detects `podman` first, then falls back to `docker`.

You can also run compose directly if you prefer (WINDOWS):
```bash
podman compose build
podman compose up -d

# or if you have docker (api it's the same)
docker compose build
docker compose up -d
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
make add PKG=<package-name>
```

If you changed volume settings, recreate the app container once:
```bash
make down
make up
```