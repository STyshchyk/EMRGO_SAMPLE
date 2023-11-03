#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

TARGET_APP_NAME=client-account
docker build --build-arg $TARGET_APP_NAME -t $TARGET_APP_NAME:latest .
