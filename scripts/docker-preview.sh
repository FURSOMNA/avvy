#!/usr/bin/env bash

docker run --rm -it \
  -p 3000:8080 \
  --network avvy-dev-services_default \
  --env-file .env \
  avvy-app:local
