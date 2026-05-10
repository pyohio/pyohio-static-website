"""OG image generation CLI."""

from __future__ import annotations

from pathlib import Path

import click

from pyohio_cli.og.generator import generate, preview

DEFAULT_CONTENT_DIR = Path("2026/content")
DEFAULT_TEMPLATES_DIR = Path("2026/_og-templates")
DEFAULT_OUTPUT_DIR = Path("2026/_static/img/og")
DEFAULT_STATIC_DIR = Path("2026/_static")
DEFAULT_PUBLIC_URL_BASE = "https://www.pyohio.org/2026/img/og"


@click.group()
def og():
    """Generate per-page OpenGraph images."""


@og.command("generate")
@click.option(
    "--content-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_CONTENT_DIR,
    show_default=True,
)
@click.option(
    "--templates-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_TEMPLATES_DIR,
    show_default=True,
)
@click.option(
    "--output-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_OUTPUT_DIR,
    show_default=True,
    help="Where generated PNGs are written (talks/ and speakers/ subdirs).",
)
@click.option(
    "--static-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_STATIC_DIR,
    show_default=True,
    help="Site static dir; used to resolve avatar/logo file:// URLs.",
)
@click.option(
    "--public-url-base",
    default=DEFAULT_PUBLIC_URL_BASE,
    show_default=True,
    help="Public URL prefix written into each page's og_image frontmatter.",
)
@click.option(
    "--only",
    type=click.Choice(["all", "talks", "speakers"]),
    default="all",
    show_default=True,
)
@click.option(
    "--skip-frontmatter-update",
    is_flag=True,
    help="Render PNGs only; don't touch markdown frontmatter.",
)
def generate_cmd(
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    public_url_base: str,
    only: str,
    skip_frontmatter_update: bool,
):
    """Render OG cards for talks and speakers and update frontmatter."""
    generate(
        content_dir=content_dir,
        templates_dir=templates_dir,
        output_dir=output_dir,
        static_dir=static_dir,
        public_url_base=public_url_base,
        only=only,
        skip_frontmatter_update=skip_frontmatter_update,
    )
    click.echo("Done.", err=True)


@og.command("preview")
@click.argument("slug")
@click.option(
    "--content-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_CONTENT_DIR,
    show_default=True,
)
@click.option(
    "--templates-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_TEMPLATES_DIR,
    show_default=True,
)
@click.option(
    "--static-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_STATIC_DIR,
    show_default=True,
)
@click.option(
    "--png",
    "write_png",
    is_flag=True,
    help="Also screenshot the preview to _preview.png.",
)
def preview_cmd(
    slug: str,
    content_dir: Path,
    templates_dir: Path,
    static_dir: Path,
    write_png: bool,
):
    """Render a single talk/speaker OG card for visual iteration.

    Writes _preview.html (and optionally _preview.png) into the templates dir.
    Open the printed file:// URL in a browser; edit the template; refresh.
    """
    html_path, png_path = preview(
        slug=slug,
        content_dir=content_dir,
        templates_dir=templates_dir,
        output_dir=templates_dir,
        static_dir=static_dir,
        write_png=write_png,
    )
    click.echo(f"HTML: {html_path.resolve().as_uri()}")
    if png_path:
        click.echo(f"PNG:  {png_path}")
