CONTAINER_ENGINE := $(shell if command -v podman >/dev/null 2>&1; then echo podman; elif command -v docker >/dev/null 2>&1; then echo docker; fi)

ifeq ($(strip $(CONTAINER_ENGINE)),)
$(error Neither podman nor docker was found in PATH)
endif

COMPOSE := $(CONTAINER_ENGINE) compose
SERVICE := learn-hanzi-client

.PHONY: help build up down logs shell add

help:
	@echo "Using container engine: $(CONTAINER_ENGINE)"
	@echo "Targets: build | up | down | logs | shell | add PKG=<package>"

build:
	$(COMPOSE) build

up:
	$(COMPOSE) up -d --build

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f $(SERVICE)

shell:
	$(COMPOSE) exec $(SERVICE) bash

add:
	@if [ -z "$(PKG)" ]; then echo "Usage: make add PKG=<package-name>"; exit 1; fi
	$(COMPOSE) exec $(SERVICE) pnpm add $(PKG)

