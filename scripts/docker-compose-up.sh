#!/usr/bin/env bash

COMPOSE_FILE=docker-compose.dev.yml
INFISICAL_COMPOSE_FILE=services/infisical/docker-compose.yml

if ! docker compose -f "$COMPOSE_FILE" ps -q avvy_mongo | grep -q .; then
  docker compose -f "$COMPOSE_FILE" up -d
fi

if ! docker compose -f "$INFISICAL_COMPOSE_FILE" ps -q avvy_infisical_backend | grep -q .; then
  docker compose -f "$INFISICAL_COMPOSE_FILE" up -d
fi
