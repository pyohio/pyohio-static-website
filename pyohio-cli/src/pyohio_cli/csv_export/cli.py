"""CSV export CLI."""

from __future__ import annotations

import os
from pathlib import Path

import click

from pyohio_cli.csv_export.generator import generate

DEFAULT_BASE_URL = "https://www.pyohio.org"


@click.group()
def csv():
    """Generate CSV exports of site content."""


@csv.command("generate")
@click.option(
    "--content-json",
    type=click.Path(dir_okay=False, path_type=Path),
    default=None,
    help="Rockgarden content metadata. Defaults to $ROCKGARDEN_CONTENT_JSON, "
    "then .rockgarden/content.json.",
)
@click.option(
    "--output",
    type=click.Path(dir_okay=False, path_type=Path),
    default=None,
    help="Output CSV path. Defaults to "
    "$ROCKGARDEN_OUTPUT/program/speakers/speakers.csv, then "
    "_site/program/speakers/speakers.csv.",
)
@click.option(
    "--base-url",
    default=DEFAULT_BASE_URL,
    show_default=True,
    help="Site origin prepended to page paths to form absolute URLs.",
)
def generate_cmd(content_json: Path | None, output: Path | None, base_url: str):
    """Write a speakers/talks CSV (one row per speaker/talk pairing).

    Designed to run as a Rockgarden post_collect hook so it picks up
    $ROCKGARDEN_CONTENT_JSON and $ROCKGARDEN_OUTPUT automatically.
    """
    if content_json is None:
        env = os.environ.get("ROCKGARDEN_CONTENT_JSON")
        content_json = Path(env) if env else Path(".rockgarden/content.json")

    if output is None:
        out_root = os.environ.get("ROCKGARDEN_OUTPUT")
        output = (
            Path(out_root) / "program" / "speakers" / "speakers.csv"
            if out_root
            else Path("_site/program/speakers/speakers.csv")
        )

    if not content_json.exists():
        raise click.UsageError(
            f"Content metadata not found at {content_json}. "
            "Run this as a post_collect hook, or build the site first."
        )

    count = generate(content_json=content_json, output=output, base_url=base_url)
    click.echo(f"Wrote {count} row(s) to {output}", err=True)
