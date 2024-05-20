#! /bin/bash

TOKEN="gldt-JsxJxqKgDCLP5NAJHrFV"
USER="gitlab+deploy-token-4279730"

echo "$TOKEN" | docker login registry.gitlab.com -u "$USER" --password-stdin
echo "DONE"
