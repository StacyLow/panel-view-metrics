#!/usr/bin/env python3

import os
import sys
from datetime import datetime
import requests
from basisvectors.client import ClientSession

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_PANEL_URL")
SUPABASE_API_KEY = os.getenv("SUPABASE_API_KEY")
PANELS_TABLE = "panels"

# Validate environment variables
if not SUPABASE_URL or not SUPABASE_API_KEY:
    print("Error: Missing required environment variables SUPABASE_PANEL_URL or SUPABASE_API_KEY")
    sys.exit(1)

HEADERS = {
    "apikey": SUPABASE_API_KEY,
    "Authorization": f"Bearer {SUPABASE_API_KEY}",
    "Content-Type": "application/json",
}


def log_message(message):
    """Log message with timestamp"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")


def get_existing_panel_serials():
    """Fetch existing panel serials from Supabase"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/{PANELS_TABLE}?select=panel_serial"
        response = requests.get(url, headers=HEADERS, timeout=30)
        response.raise_for_status()
        return set(row["panel_serial"] for row in response.json() if row["panel_serial"])
    except requests.exceptions.RequestException as e:
        log_message(f"Error fetching existing panels: {e}")
        return set()


def insert_panel(panel_serial, created_at):
    """Insert a new panel into Supabase"""
    try:
        url = f"{SUPABASE_URL}/rest/v1/{PANELS_TABLE}"
        data = {
            "panel_serial": panel_serial,
            "created_at": created_at,
        }
        response = requests.post(url, headers=HEADERS, json=data, timeout=30)
        response.raise_for_status()
        log_message(f"Successfully inserted panel {panel_serial}")
        return True
    except requests.exceptions.RequestException as e:
        log_message(f"Error inserting panel {panel_serial}: {e}")
        return False


def upload_panels_to_supabase(panels):
    """Upload new panels to Supabase, avoiding duplicates"""
    if not panels:
        log_message("No panels found from API")
        return
    
    existing_serials = get_existing_panel_serials()
    unique_serials = set()
    inserted_count = 0
    skipped_count = 0
    
    for panel in panels:
        serial = panel.get("serial")
        created_at = panel.get("created")
        
        if not serial or not created_at:
            log_message(f"Skipping panel with missing data: {panel}")
            continue
            
        if serial not in existing_serials and serial not in unique_serials:
            if insert_panel(serial, created_at):
                unique_serials.add(serial)
                inserted_count += 1
        else:
            skipped_count += 1
    
    log_message(f"Upload completed: {inserted_count} inserted, {skipped_count} skipped")


def main():
    """Main function to fetch and upload panel data"""
    try:
        log_message("Starting panel data upload process")
        
        # Initialize client session
        cs = ClientSession("https://apps.data.wearebasis.io/api/v1")
        
        # Fetch panels from API
        panels = cs.get_devices(type_id=0)
        log_message(f"Found {len(panels)} panels in production")
        
        # Upload to Supabase
        upload_panels_to_supabase(panels)
        
        log_message("Panel data upload process completed successfully")
        
    except Exception as e:
        log_message(f"Fatal error in main process: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()