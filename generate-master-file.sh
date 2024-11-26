#!/bin/bash

output_file="paste.txt"
log_file="script_log.txt"

# Function to log messages
log_message() {
    echo "$1"
    echo "$(date): $1" >> "$log_file"
}

log_message "Script started"

# Array of directories/files to skip
skip_paths=(
    "node_modules"
    ".git"
    ".next"
    ".vercel"
    ".vscode"
    "dist"
    "build"
    "coverage"
    ".github"
    ".wrangler"
    "out"
)

# Array of files to truncate content
truncate_files=(
    "package-lock.json"
    "yarn.lock"
    "pnpm-lock.yaml"
    ".env"
    ".env.local"
    ".env.development"
    ".env.test"
    ".env.production"
    ".gitignore"
    "README.md"
)

# Array of files to exclude from output
exclude_files=(
    ".eslintrc.json"
    ".prettierrc"
    "tsconfig.json"
    "next.config.js"
    "postcss.config.js"
    "tailwind.config.js"
    "package.json"
)

# Function to create section separator
create_separator() {
    echo -e "\n------------------" >> "$output_file"
}

# Function to check if file should be truncated
should_truncate() {
    local file=$1
    for truncate_file in "${truncate_files[@]}"; do
        if [[ $file == *"$truncate_file"* ]]; then
            return 0
        fi
    done
    return 1
}

# Function to check if file should be excluded
should_exclude() {
    local file=$1
    for exclude_file in "${exclude_files[@]}"; do
        if [[ $file == *"$exclude_file"* ]]; then
            return 0
        fi
    done
    return 1
}

# Function to output file content
output_file_content() {
    local file=$1
    if [ -f "$file" ] && ! should_exclude "$file"; then
        create_separator
        echo "// $file" >> "$output_file"
        
        if should_truncate "$file"; then
            echo -e "\n/* File truncated for brevity */\n" >> "$output_file"
        else
            if [ ! -s "$file" ]; then
                echo -e "\n/* TODO: This file needs implementation */\n" >> "$output_file"
            else
                cat "$file" >> "$output_file"
                echo "" >> "$output_file"
            fi
        fi
    fi
    log_message "Processed file: $file"
}

# Remove existing output file
rm -f "$output_file"
log_message "Removed existing output file"

# Generate directory tree
echo "Project Structure:" > "$output_file"
echo "=================" >> "$output_file"
echo "" >> "$output_file"

log_message "Generating directory tree"
# Use tree command to generate the directory structure, excluding specified paths
tree -L 4 --charset=ascii -F -I "$(IFS='|'; echo "${skip_paths[*]}")" | sed 's/\`/|/' >> "$output_file"
log_message "Directory tree generated"

echo "" >> "$output_file"
echo "File Contents:" >> "$output_file"
echo "=============" >> "$output_file"

log_message "Processing files"
# Find and process files with exclusions
find . -type f \( \
    -name '*.ts' -o \
    -name '*.tsx' -o \
    -name '*.js' -o \
    -name '*.jsx' -o \
    -name '*.css' -o \
    -name '*.json' -o \
    -name '*.toml' -o \
    -name '*.mjs' \
    \) \
    $(printf "! -path './%s/*' " "${skip_paths[@]}") \
    -not -name '*.tsbuildinfo' \
    -not -name '*.log' \
    -not -name '*.pem' \
    -not -name '*.tgz' \
    | sort | while read -r file; do
    should_process=true
    for skip_path in "${skip_paths[@]}"; do
        if [[ $file == ./$skip_path/* ]]; then
            should_process=false
            break
        fi
    done
    if $should_process; then
        output_file_content "$file"
    fi
done

log_message "File generated: $output_file"
log_message "Script completed"
