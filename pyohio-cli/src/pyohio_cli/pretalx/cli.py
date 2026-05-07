"""PreTalx CLI commands."""

from __future__ import annotations

import os
from pathlib import Path

import click

from pyohio_cli.pretalx.config import load_config
from pyohio_cli.pretalx.processor import run_fetch

DEFAULT_CONFIG = Path("2026/pretalx.toml")
DEFAULT_CONTENT_DIR = Path("2026/content")
DEFAULT_AVATAR_CACHE = Path("pyohio-cli/avatar_cache")
DEFAULT_AVATAR_OUTPUT = Path("2026/_static/img/speakers")
DEFAULT_AVATAR_PUBLIC_PREFIX = "/2026/img/speakers"


@click.group()
def pretalx():
    """Fetch talks and speakers from PreTalx."""


@pretalx.command()
@click.option(
    "--config",
    "config_path",
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
    default=DEFAULT_CONFIG,
    show_default=True,
    help="Path to the year's pretalx.toml config.",
)
@click.option(
    "--event-id",
    help="Override event_id from the config.",
)
@click.option(
    "--content-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_CONTENT_DIR,
    show_default=True,
    help="Rockgarden content directory.",
)
@click.option(
    "--avatar-cache-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_AVATAR_CACHE,
    show_default=True,
    help="Persistent avatar cache (committed).",
)
@click.option(
    "--avatar-output-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_AVATAR_OUTPUT,
    show_default=True,
    help="Site static dir for speaker avatars.",
)
@click.option(
    "--avatar-public-prefix",
    default=DEFAULT_AVATAR_PUBLIC_PREFIX,
    show_default=True,
    help="Public URL prefix written into speaker frontmatter.",
)
@click.option(
    "--skip-avatars",
    is_flag=True,
    help="Skip downloading avatars; reuse whatever is already in the output dir.",
)
@click.option("-v", "--verbose", is_flag=True)
def fetch(
    config_path: Path,
    event_id: str | None,
    content_dir: Path,
    avatar_cache_dir: Path,
    avatar_output_dir: Path,
    avatar_public_prefix: str,
    skip_avatars: bool,
    verbose: bool,
):
    """Fetch confirmed talks and speakers; write content files and cache avatars."""
    api_key = os.environ.get("PRETALX_API_KEY")
    if not api_key:
        raise click.UsageError("PRETALX_API_KEY environment variable is required.")

    config = load_config(config_path)
    if event_id:
        config.event_id = event_id

    run_fetch(
        api_key=api_key,
        config=config,
        content_dir=content_dir,
        avatar_cache_dir=avatar_cache_dir,
        avatar_output_dir=avatar_output_dir,
        avatar_public_prefix=avatar_public_prefix,
        skip_avatars=skip_avatars,
        verbose=verbose,
    )
    click.echo("Done.", err=True)
