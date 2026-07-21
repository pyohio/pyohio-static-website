"""High-level pipeline: read talk frontmatter, render 1920×1080 title slides.

Mirrors the OG image pipeline (see pyohio_cli.og.generator) but produces
landscape presentation slides for talks. Shared helpers are imported from the
OG module so the two pipelines stay in sync.
"""

from __future__ import annotations

import tempfile
from pathlib import Path

import click
from jinja2 import Environment

from pyohio_cli._frontmatter import read_frontmatter
from pyohio_cli.og.generator import (
    KEEP_FILES,
    MANIFEST_NAME,
    _compute_input_hash,
    _file_url,
    _jinja_env,
    _join_names,
    _load_manifest,
    _prune_orphans,
    _render_html,
    _resolve_avatar_fs,
    _save_manifest,
)
from pyohio_cli.slides.renderer import SlideRenderer

BRAND_LABEL = "PyOhio 2026"


def _resolve_assets(static_dir: Path) -> tuple[Path, Path]:
    """Return (logo_path, no_profile) or raise if a required asset is missing."""
    logo_path = static_dir / "img" / "pyohio-square-accent.png"
    no_profile = static_dir / "img" / "speakers" / "no-profile.png"
    if not logo_path.exists():
        raise click.UsageError(f"Logo not found at {logo_path}")
    if not no_profile.exists():
        raise click.UsageError(f"Placeholder avatar not found at {no_profile}")
    return logo_path, no_profile


def _build_talk_context(
    md_path: Path,
    *,
    static_dir: Path,
    no_profile: Path,
    logo_path: Path,
) -> tuple[dict, list[Path]]:
    fm = read_frontmatter(md_path)
    speakers_fm = fm.get("speakers") or []
    speaker_avatar_fs = [
        _resolve_avatar_fs(s.get("avatar"), static_dir, no_profile)
        for s in speakers_fm
    ]
    speaker_ctx = [
        {"name": s.get("name", ""), "avatar": _file_url(p)}
        for s, p in zip(speakers_fm, speaker_avatar_fs)
    ]

    # Keynote talks carry a placeholder title ("Keynote"); promote the
    # speaker name to the title and label it with an eyebrow, so the slide
    # reads as a keynote rather than showing a useless one-word title.
    is_keynote = str(fm.get("type", "")).lower() == "keynote"
    if is_keynote and speakers_fm:
        eyebrow = "Keynote"
        title = _join_names([s.get("name", "") for s in speakers_fm])
        names = ""
    else:
        eyebrow = None
        title = str(fm.get("title") or md_path.stem)
        names = _join_names([s.get("name", "") for s in speakers_fm])

    ctx = {
        "title": title,
        "eyebrow": eyebrow,
        "brand_label": BRAND_LABEL,
        "speakers": speaker_ctx,
        "names": names,
        "logo_path": _file_url(logo_path),
    }
    assets = [logo_path, *speaker_avatar_fs]
    return ctx, assets


def generate(
    *,
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    force: bool = False,
) -> None:
    talks_dir = content_dir / "program" / "talks"
    output_dir.mkdir(parents=True, exist_ok=True)

    logo_path, no_profile = _resolve_assets(static_dir)
    env = _jinja_env(templates_dir)

    manifest_path = output_dir / MANIFEST_NAME
    manifest = _load_manifest(manifest_path)

    if not talks_dir.exists():
        raise click.UsageError(f"Talks directory not found at {talks_dir}")

    talk_md_files = [p for p in talks_dir.glob("*.md") if p.name not in KEEP_FILES]
    seen_slugs: set[str] = set()
    template = env.get_template("title.html")

    with SlideRenderer() as renderer, tempfile.TemporaryDirectory() as tmpdir_str:
        tmpdir = Path(tmpdir_str)

        for md_path in sorted(talk_md_files):
            slug = md_path.stem
            seen_slugs.add(slug)
            ctx, assets = _build_talk_context(
                md_path,
                static_dir=static_dir,
                no_profile=no_profile,
                logo_path=logo_path,
            )

            html = template.render(**ctx)
            input_hash = _compute_input_hash(html, assets)
            out_png = output_dir / f"{slug}.png"
            key = f"{slug}.png"

            if not force and manifest.get(key) == input_hash and out_png.exists():
                click.echo(f"  skip slide {slug} (unchanged)", err=True)
            else:
                html_path = tmpdir / f"slide-{slug}.html"
                html_path.write_text(html)
                renderer.render(html_path, out_png)
                manifest[key] = input_hash
                click.echo(f"  rendered slide {slug}", err=True)

    _prune_orphans(output_dir, seen_slugs, manifest=manifest, prefix="")
    _save_manifest(manifest_path, manifest)


def preview(
    *,
    slug: str,
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    write_png: bool = False,
) -> tuple[Path, Path | None]:
    """Render a single talk title slide for visual iteration.

    Writes the rendered HTML to <output_dir>/_preview.html (open in a browser,
    refresh after template edits). When ``write_png=True``, also screenshots to
    <output_dir>/_preview.png.

    Returns (html_path, png_path or None).
    """
    talks_md = content_dir / "program" / "talks" / f"{slug}.md"
    if not talks_md.exists():
        raise click.UsageError(f"No talk found with slug '{slug}'. Checked {talks_md}.")

    logo_path, no_profile = _resolve_assets(static_dir)
    env = _jinja_env(templates_dir)

    ctx, _ = _build_talk_context(
        talks_md,
        static_dir=static_dir,
        no_profile=no_profile,
        logo_path=logo_path,
    )

    output_dir.mkdir(parents=True, exist_ok=True)
    html_path = output_dir / "_preview.html"
    _render_html(env, "title.html", ctx, html_path)

    png_path: Path | None = None
    if write_png:
        png_path = output_dir / "_preview.png"
        with SlideRenderer() as r:
            r.render(html_path, png_path)

    click.echo(f"Rendered title slide preview for {slug!r}", err=True)
    return html_path, png_path
