#!/bin/bash

# Function to create directory if it doesn't exist
create_dir() {
    local dir=$(dirname "$1")
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "Created directory: $dir"
    fi
}

# Read the input file line by line
current_file=""
while IFS= read -r line; do
    # Check if line starts with the file path marker
    if [[ $line == "// "* && $line == *".tsx" ]]; then
        # If we were writing to a file, close it
        if [ ! -z "$current_file" ]; then
            echo "" >> "$current_file"
        fi
        
        # Extract the file path and prepare for new file
        current_file=${line#// }
        create_dir "$current_file"
        
        echo "Creating/Updating file: $current_file"
        # Clear/create the file
        > "$current_file"
        continue
    fi
    
    # Write content to current file if we have one
    if [ ! -z "$current_file" ]; then
        echo "$line" >> "$current_file"
    fi
done

echo "File splitting complete!"