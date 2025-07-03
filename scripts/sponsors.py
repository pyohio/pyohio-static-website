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


def download_logo(logo_url, filename, verbose=False):
    """Download a logo file from URL and save it locally"""
    if not logo_url:
        if verbose:
            click.echo("DEBUG: No logo URL provided", err=True)
        return None
    
    if verbose:
        click.echo(f"DEBUG: Downloading {logo_url} -> {filename}", err=True)
    
    try:
        response = httpx.get(logo_url)
        response.raise_for_status()
        
        LOGOS_DIR.mkdir(parents=True, exist_ok=True)
        filepath = LOGOS_DIR / filename
        
        if verbose:
            click.echo(f"DEBUG: Saving to {filepath}", err=True)
        
        with open(filepath, "wb") as f:
            f.write(response.content)
        
        relative_path = str(filepath.relative_to(Path("./2025/src/assets")))
        
        if verbose:
            click.echo(f"DEBUG: Download successful, relative path: {relative_path}", err=True)
        
        return relative_path
    except httpx.HTTPStatusError as e:
        click.echo(f"HTTP Error downloading logo {logo_url}: {e.response.status_code}", err=True)
        return None
    except Exception as e:
        click.echo(f"Failed to download logo {logo_url}: {e}", err=True)
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
@click.option("-v", "--verbose", is_flag=True, help="Enable verbose debug output")
@click.pass_context
def get_individual_sponsors(ctx, verbose):
    """Get individual sponsor data from PyOhio Admin API"""

    click.echo("Getting individual sponsors...", err=True)
    
    try:
        sponsor_list = httpx.get(INDIVIDUAL_SPONSORS_URL)
        sponsor_list.raise_for_status()
    except httpx.HTTPStatusError as e:
        click.echo(f"HTTP Error {sponsor_list.status_code}: {sponsor_list.text}", err=True)
        raise
    except Exception as e:
        click.echo(f"Error fetching individual sponsors: {e}", err=True)
        raise

    sponsors = sponsor_list.json()
    click.echo(f"Got {len(sponsors)} individual sponsors", err=True)
    
    if verbose:
        click.echo(f"DEBUG: Individual sponsors: {sponsors}", err=True)
    
    # The new endpoint returns a simple list of strings in order
    # Convert to the format expected by the site
    sponsors_data = {"sponsors": sponsors}

    save_filename = Path(f"{DATA_DIR}/individualSponsors/individual-sponsors.yaml")
    save_filename.parent.mkdir(parents=True, exist_ok=True)
    
    click.echo(f"Writing individual sponsors to {save_filename}", err=True)
    with open(save_filename, "w") as save_file:
        yaml.dump(sponsors_data, save_file, allow_unicode=True)
    
    click.echo("Individual sponsors data saved successfully", err=True)


@sponsors.command()
@click.option("-v", "--verbose", is_flag=True, help="Enable verbose debug output")
@click.option("--skip-images", is_flag=True, help="Skip downloading sponsor logo images")
@click.pass_context
def get_sponsors(ctx, verbose, skip_images):
    """Get corporate sponsor data from PyOhio Admin API"""

    click.echo("Getting corporate sponsors...", err=True)
    
    try:
        sponsor_list = httpx.get(SPONSORS_URL)
        sponsor_list.raise_for_status()
    except httpx.HTTPStatusError as e:
        click.echo(f"HTTP Error {sponsor_list.status_code}: {sponsor_list.text}", err=True)
        raise
    except Exception as e:
        click.echo(f"Error fetching sponsors: {e}", err=True)
        raise

    sponsors = sponsor_list.json()
    click.echo(f"Got {len(sponsors)} corporate sponsors", err=True)

    sponsors_dir = Path(f"{DATA_DIR}/sponsors")
    sponsors_dir.mkdir(parents=True, exist_ok=True)
    
    if verbose:
        click.echo(f"DEBUG: Sponsors directory: {sponsors_dir}", err=True)

    for i, sponsor in enumerate(sponsors):
        sponsor_name = sponsor.get("name", "Unknown")
        click.echo(f"Processing sponsor {i+1}/{len(sponsors)}: {sponsor_name}", err=True)
        
        sponsor["slug"] = slugify(sponsor["name"])
        
        if verbose:
            click.echo(f"DEBUG: Sponsor slug: {sponsor['slug']}", err=True)
            click.echo(f"DEBUG: Sponsor tier: {sponsor.get('tier', {}).get('name', 'Unknown')}", err=True)
        
        if not skip_images:
            # Download logos locally
            if sponsor.get("logo_light", {}).get("file_url"):
                if verbose:
                    click.echo(f"DEBUG: Processing light logo for {sponsor_name}", err=True)
                
                # Extract file extension from file_name or file_url
                if "file_name" in sponsor["logo_light"]:
                    light_ext = sponsor["logo_light"]["file_name"].split('.')[-1]
                    if verbose:
                        click.echo(f"DEBUG: Light logo extension from file_name: {light_ext}", err=True)
                else:
                    # Fallback to extracting from URL
                    light_ext = sponsor["logo_light"]["file_url"].split('.')[-1]
                    if verbose:
                        click.echo(f"DEBUG: Light logo extension from URL: {light_ext}", err=True)
                
                light_filename = f"{sponsor['slug']}-light.{light_ext}"
                click.echo(f"  Downloading light logo: {light_filename}", err=True)
                
                local_light_path = download_logo(sponsor["logo_light"]["file_url"], light_filename, verbose)
                if local_light_path:
                    sponsor["logo_light"]["local_path"] = local_light_path
                    if verbose:
                        click.echo(f"DEBUG: Light logo saved to: {local_light_path}", err=True)
            else:
                if verbose:
                    click.echo(f"DEBUG: No light logo found for {sponsor_name}", err=True)
            
            if sponsor.get("logo_dark", {}).get("file_url"):
                if verbose:
                    click.echo(f"DEBUG: Processing dark logo for {sponsor_name}", err=True)
                
                # Extract file extension from file_name or file_url
                if "file_name" in sponsor["logo_dark"]:
                    dark_ext = sponsor["logo_dark"]["file_name"].split('.')[-1]
                    if verbose:
                        click.echo(f"DEBUG: Dark logo extension from file_name: {dark_ext}", err=True)
                else:
                    # Fallback to extracting from URL
                    dark_ext = sponsor["logo_dark"]["file_url"].split('.')[-1]
                    if verbose:
                        click.echo(f"DEBUG: Dark logo extension from URL: {dark_ext}", err=True)
                
                dark_filename = f"{sponsor['slug']}-dark.{dark_ext}"
                click.echo(f"  Downloading dark logo: {dark_filename}", err=True)
                
                local_dark_path = download_logo(sponsor["logo_dark"]["file_url"], dark_filename, verbose)
                if local_dark_path:
                    sponsor["logo_dark"]["local_path"] = local_dark_path
                    if verbose:
                        click.echo(f"DEBUG: Dark logo saved to: {local_dark_path}", err=True)
            else:
                if verbose:
                    click.echo(f"DEBUG: No dark logo found for {sponsor_name}", err=True)
        else:
            click.echo(f"  Skipping image download for {sponsor_name}", err=True)
        
        save_filename = sponsors_dir / f"{sponsor['slug']}.yaml"
        click.echo(f"  Writing sponsor data to {save_filename.name}", err=True)
        
        with open(save_filename, "w") as save_file:
            yaml.dump(sponsor, save_file, allow_unicode=True)
        
        if verbose:
            click.echo(f"DEBUG: Saved sponsor {sponsor_name} successfully", err=True)
    
    click.echo(f"Corporate sponsors processing complete! Processed {len(sponsors)} sponsors", err=True)


if __name__ == "__main__":
    sponsors()
