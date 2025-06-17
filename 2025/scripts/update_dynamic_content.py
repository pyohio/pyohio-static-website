#!/usr/bin/env python3
"""
Script to update dynamic content in markdown files with values from constants.
This helps maintain consistency across static content files.
"""

import re
from pathlib import Path

# Configuration values that match constants.ts
EVENT_NAME = "PyOhio 2025"
EVENT_DATES_LONG = "July 26-27"
EVENT_DATES_FULL = "July 26-27, 2025"
CURRENT_YEAR = "18th"
EVENT_YEAR = "2025"

# Files to update
FILES_TO_UPDATE = [
    "src/pages/about/index.md",
    "src/pages/attend/venue.md",
    "src/pages/sponsors/prospectus.md",
]

def update_file(file_path, replacements):
    """Update a file with the given replacements."""
    path = Path(file_path)
    if not path.exists():
        print(f"File not found: {file_path}")
        return
    
    content = path.read_text()
    original_content = content
    
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content)
    
    if content != original_content:
        path.write_text(content)
        print(f"Updated: {file_path}")
    else:
        print(f"No changes needed: {file_path}")

# Define replacements for each file
replacements_about = {
    r"The \d+\w+ annual PyOhio": f"The {CURRENT_YEAR} annual PyOhio",
    r"July \d+-\d+ in": f"{EVENT_DATES_LONG} in",
    r"PyOhio \d{4} logo": f"{EVENT_NAME} logo",
}

replacements_venue = {
    r"# PyOhio \d{4} Venue": f"# {EVENT_NAME} Venue",
    r"PyOhio \d{4} will be held": f"{EVENT_NAME} will be held",
}

replacements_prospectus = {
    r"PyOhio \d{4} Sponsorship": f"{EVENT_NAME} Sponsorship",
    r"PyOhio-\d{4}-Sponsorship": f"PyOhio-{EVENT_YEAR}-Sponsorship",
}

# Update files
if __name__ == "__main__":
    script_dir = Path(__file__).parent
    repo_root = script_dir.parent
    
    # Change to repo root
    import os
    os.chdir(repo_root)
    
    update_file("src/pages/about/index.md", replacements_about)
    update_file("src/pages/attend/venue.md", replacements_venue)
    update_file("src/pages/sponsors/prospectus.md", replacements_prospectus)
    
    print("\nNote: This script updates static content. For dynamic content in .astro files,")
    print("import { SITE_CONFIG, getEventDateInfo } from '../utils/constants' and use the values directly.")