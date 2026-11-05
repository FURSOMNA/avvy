#!/usr/bin/env bash

COMPOSE_FILE=docker-compose.dev.yml
INFISICAL_COMPOSE_FILE=services/infisical/docker-compose.yml

docker compose -f "$COMPOSE_FILE" down
docker compose -f "$INFISICAL_COMPOSE_FILE" down
