#!/usr/bin/env python
from pathlib import Path

import click
import httpx
import yaml

from slugify import slugify

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    pass


INDIVIDUAL_SPONSORS_URL = "https://admin.pyohio.org/api/individual-sponsors"
SPONSORS_URL = "https://admin.pyohio.org/api/sponsors"
DATA_DIR = Path("./2024/src/content")


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

    save_filename = Path(f"{DATA_DIR}/individual-sponsors/individual-sponsors.yaml")
    with open(save_filename, "w") as save_file:
        yaml.dump(sponsors, save_file, allow_unicode=True)


@sponsors.command()
@click.pass_context
def get_sponsors(ctx):
    """Get corporate sponsor data from PyOhio Admin API"""

    sponsor_list = httpx.get(SPONSORS_URL)
    sponsor_list.raise_for_status()

    sponsors = sponsor_list.json()

    for sponsor in sponsors:
        sponsor["slug"] = slugify(sponsor["name"])
        save_filename = Path(f"{DATA_DIR}/sponsors/{sponsor['slug']}.yaml")
        with open(save_filename, "w") as save_file:
            yaml.dump(sponsor, save_file, allow_unicode=True)


if __name__ == "__main__":
    sponsors()
