#!/usr/bin/env bash
set -euo pipefail

docker build --platform linux/amd64 \
  --build-arg VERSION=local \
  --build-arg SOURCE=local \
  --build-arg REVISION="$(git rev-parse --short HEAD)" \
  -t avvy-app:local .
