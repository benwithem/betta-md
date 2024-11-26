#!/bin/bash

output_file="masterfile.txt"

# Function to check if a file exists and output its contents
output_file_content() {
  if [ -f "$1" ]; then
    echo "// $1" >> "$output_file"
    cat "$1" >> "$output_file"
    echo "" >> "$output_file"
  else
    echo "// $1 does not exist" >> "$output_file"
    echo "" >> "$output_file"
  fi
}

# Remove the output file if it already exists
rm -f "$output_file"

# Output the contents of each file in the app/ directory recursively
for file in app/**/*; do
  if [ -f "$file" ]; then
    output_file_content "$file"
  fi
done

# Output the contents of each file in the root directory
output_file_content "env.d.ts"
output_file_content "next-env.d.ts"
output_file_content "next.config.mjs"
output_file_content "postcss.config.mjs"
output_file_content "tailwind.config.js"
output_file_content "tailwind.config.ts"
output_file_content "tsconfig.json"
output_file_content "wrangler.toml"

echo "Master file generated: $output_file"