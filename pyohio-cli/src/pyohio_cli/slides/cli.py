"""Title slide generation CLI."""

from __future__ import annotations

from pathlib import Path

import click

from pyohio_cli.slides.generator import frame, generate, preview

DEFAULT_CONTENT_DIR = Path("2026/content")
DEFAULT_TEMPLATES_DIR = Path("2026/_slide-templates")
DEFAULT_OUTPUT_DIR = Path("2026/_static/img/title-slides")
DEFAULT_STATIC_DIR = Path("2026/_static")
DEFAULT_FRAME_OUTPUT = Path("2026/_static/img/video-frame.png")


@click.group()
def slides():
    """Generate 1920×1080 title slides for talks."""


@slides.command("generate")
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
    help="Where generated title-slide PNGs are written.",
)
@click.option(
    "--static-dir",
    type=click.Path(file_okay=False, path_type=Path),
    default=DEFAULT_STATIC_DIR,
    show_default=True,
    help="Site static dir; used to resolve avatar/logo file:// URLs.",
)
@click.option(
    "--force",
    is_flag=True,
    help="Re-render every PNG even if inputs are unchanged.",
)
def generate_cmd(
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    force: bool,
):
    """Render a 1920×1080 title slide for every talk."""
    generate(
        content_dir=content_dir,
        templates_dir=templates_dir,
        output_dir=output_dir,
        static_dir=static_dir,
        force=force,
    )
    click.echo("Done.", err=True)


@slides.command("preview")
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
    """Render a single talk title slide for visual iteration.

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


@slides.command("frame")
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
    "--output",
    "output_path",
    type=click.Path(dir_okay=False, path_type=Path),
    default=DEFAULT_FRAME_OUTPUT,
    show_default=True,
    help="Where the video-frame PNG is written.",
)
def frame_cmd(templates_dir: Path, static_dir: Path, output_path: Path):
    """Render the solid-purple video-production frame (branding only)."""
    frame(
        templates_dir=templates_dir,
        output_path=output_path,
        static_dir=static_dir,
    )
    click.echo("Done.", err=True)
