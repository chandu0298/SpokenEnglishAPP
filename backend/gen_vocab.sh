#!/bin/bash
# Background vocabulary generation script

CATEGORIES=("technology" "arts and entertainment" "science" "law and government" "communication")

for level in B1 B2 C1 C2; do
  echo "=== Generating for $level ===" >> /tmp/vocab_gen.log
  for cat in "${CATEGORIES[@]}"; do
    echo "  Category: $cat" >> /tmp/vocab_gen.log
    result=$(curl -s -X POST "http://localhost:8001/api/vocab/admin/generate-words" \
      -H "Content-Type: application/json" \
      -d "{\"level\": \"$level\", \"count\": 45, \"category\": \"$cat\"}")
    echo "    Result: $result" >> /tmp/vocab_gen.log
    sleep 3
  done
done

echo "=== Generation Complete ===" >> /tmp/vocab_gen.log
curl -s "http://localhost:8001/api/vocab/admin/status" >> /tmp/vocab_gen.log
