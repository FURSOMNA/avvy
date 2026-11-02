#!/usr/bin/env bash
set -euo pipefail

# Check if docker is installed first
if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker to continue."
  echo "If you are on WSL, make sure to install Docker Desktop for Windows and enable WSL integration."
  exit 1
fi

COMPOSE_FILE=docker-compose.dev.yml
INFISICAL_COMPOSE_FILE=services/infisical/docker-compose.yml

if ! docker compose -f "$COMPOSE_FILE" ps -q avvy_mongo | grep -q .; then
  docker compose -f "$COMPOSE_FILE" up -d
fi

if ! docker compose -f "$INFISICAL_COMPOSE_FILE" ps -q avvy_infisical_backend | grep -q .; then
  docker compose -f "$INFISICAL_COMPOSE_FILE" up -d
fi

trap 'docker compose -f "$COMPOSE_FILE" down; docker compose -f "$INFISICAL_COMPOSE_FILE" down' EXIT

bun --bun run dev
