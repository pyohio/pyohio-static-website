#!/usr/bin/env python
from pathlib import Path
import os

import click
import httpx
import yaml

from slugify import slugify

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    pass


INDIVIDUAL_SPONSORS_URL = "https://dashboard.pyohio.org/public/events/2025/individual-sponsors"
SPONSORS_URL = "https://dashboard.pyohio.org/public/events/2025/sponsors"
DATA_DIR = Path("./2025/src/content")
LOGOS_DIR = Path("./2025/src/assets/img/sponsors")


def download_logo(logo_url, filename):
    """Download a logo file from URL and save it locally"""
    if not logo_url:
        return None
    
    try:
        response = httpx.get(logo_url)
        response.raise_for_status()
        
        LOGOS_DIR.mkdir(parents=True, exist_ok=True)
        filepath = LOGOS_DIR / filename
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        return str(filepath.relative_to(Path("./2025/src/assets")))
    except Exception as e:
        click.echo(f"Failed to download logo {logo_url}: {e}")
        return None


@click.group()
@click.pass_context
def sponsors(ctx):
    """Get sponsor data from PyOhio Admin API"""

    ctx.obj = {}
    if not Path(".projectroot").is_file():
        click.echo(
            "File not found: .projectroot\nMake sure this command is run from the project root and not ./scripts!"
        )
        raise click.Abort()


@sponsors.command()
@click.pass_context
def get_individual_sponsors(ctx):
    """Get individual sponsor data from PyOhio Admin API"""

    sponsor_list = httpx.get(INDIVIDUAL_SPONSORS_URL)
    sponsor_list.raise_for_status()

    sponsors = sponsor_list.json()
    
    # The new endpoint returns a simple list of strings in order
    # Convert to the format expected by the site
    sponsors_data = {"sponsors": sponsors}

    save_filename = Path(f"{DATA_DIR}/individualSponsors/individual-sponsors.yaml")
    save_filename.parent.mkdir(parents=True, exist_ok=True)
    with open(save_filename, "w") as save_file:
        yaml.dump(sponsors_data, save_file, allow_unicode=True)


@sponsors.command()
@click.pass_context
def get_sponsors(ctx):
    """Get corporate sponsor data from PyOhio Admin API"""

    sponsor_list = httpx.get(SPONSORS_URL)
    sponsor_list.raise_for_status()

    sponsors = sponsor_list.json()

    sponsors_dir = Path(f"{DATA_DIR}/sponsors")
    sponsors_dir.mkdir(parents=True, exist_ok=True)

    for sponsor in sponsors:
        sponsor["slug"] = slugify(sponsor["name"])
        
        # Download logos locally
        if sponsor.get("logo_light", {}).get("file_url"):
            light_ext = sponsor["logo_light"]["file_format"]
            light_filename = f"{sponsor['slug']}-light.{light_ext}"
            local_light_path = download_logo(sponsor["logo_light"]["file_url"], light_filename)
            if local_light_path:
                sponsor["logo_light"]["local_path"] = local_light_path
        
        if sponsor.get("logo_dark", {}).get("file_url"):
            dark_ext = sponsor["logo_dark"]["file_format"]
            dark_filename = f"{sponsor['slug']}-dark.{dark_ext}"
            local_dark_path = download_logo(sponsor["logo_dark"]["file_url"], dark_filename)
            if local_dark_path:
                sponsor["logo_dark"]["local_path"] = local_dark_path
        
        save_filename = sponsors_dir / f"{sponsor['slug']}.yaml"
        with open(save_filename, "w") as save_file:
            yaml.dump(sponsor, save_file, allow_unicode=True)


if __name__ == "__main__":
    sponsors()
