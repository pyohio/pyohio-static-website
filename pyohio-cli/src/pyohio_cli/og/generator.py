"""High-level pipeline: read frontmatter, render OG cards, write back og_image."""

from __future__ import annotations

import tempfile
from pathlib import Path

import click
from jinja2 import Environment, FileSystemLoader, StrictUndefined

from pyohio_cli._frontmatter import read_frontmatter, update_frontmatter_key
from pyohio_cli.og.renderer import OGRenderer

KEEP_FILES = {"index.md", "_folder.md"}
SQUARE_SIZE = 630  # OG cards are designed with a 630×630 safe-square in the center.


def _file_url(path: Path) -> str:
    return path.resolve().as_uri()


def _avatar_to_fs(avatar_url: str | None, static_dir: Path) -> Path | None:
    """Map a public avatar URL like /2026/img/speakers/x.webp to a filesystem path.

    The site serves _static/ at the site root, so /2026/img/x.webp maps to
    <static_dir>/img/x.webp.
    """
    if not avatar_url:
        return None
    parts = avatar_url.lstrip("/").split("/", 1)
    if len(parts) < 2:
        return None
    rel = parts[1]
    candidate = static_dir / rel
    return candidate if candidate.exists() else None


def _resolve_avatar(avatar_url: str | None, static_dir: Path, fallback: Path) -> str:
    fs = _avatar_to_fs(avatar_url, static_dir)
    if fs:
        return _file_url(fs)
    return _file_url(fallback)


def _truncate(text: str, max_chars: int = 80) -> str:
    if len(text) <= max_chars:
        return text
    return text[: max_chars - 1].rstrip() + "…"


def _join_names(names: list[str]) -> str:
    if not names:
        return ""
    if len(names) == 1:
        return names[0]
    if len(names) == 2:
        return f"{names[0]} & {names[1]}"
    return _truncate(", ".join(names), 60)


def _jinja_env(templates_dir: Path) -> Environment:
    return Environment(
        loader=FileSystemLoader(str(templates_dir)),
        undefined=StrictUndefined,
        autoescape=True,
    )


def _render_html(env: Environment, template_name: str, ctx: dict, dest: Path) -> None:
    html = env.get_template(template_name).render(**ctx)
    dest.write_text(html)


def generate(
    *,
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    public_url_base: str,
    only: str = "all",
    skip_frontmatter_update: bool = False,
) -> None:
    talks_dir = content_dir / "program" / "talks"
    speakers_dir = content_dir / "program" / "speakers"
    output_dir.mkdir(parents=True, exist_ok=True)
    talks_out = output_dir / "talks"
    speakers_out = output_dir / "speakers"
    talks_out.mkdir(exist_ok=True)
    speakers_out.mkdir(exist_ok=True)

    logo_path = static_dir / "img" / "pyohio-square-primary.png"
    hero_logo_path = static_dir / "img" / "pyohio-2026-transparent.png"
    sticker_path = static_dir / "img" / "pyohio-2026-padded-sticker-square.png"
    no_profile = static_dir / "img" / "speakers" / "no-profile.png"
    if not logo_path.exists():
        raise click.UsageError(f"Logo not found at {logo_path}")
    if not hero_logo_path.exists():
        raise click.UsageError(f"Hero logo not found at {hero_logo_path}")
    if not sticker_path.exists():
        raise click.UsageError(f"Sticker not found at {sticker_path}")
    if not no_profile.exists():
        raise click.UsageError(f"Placeholder avatar not found at {no_profile}")

    env = _jinja_env(templates_dir)

    with OGRenderer() as renderer, tempfile.TemporaryDirectory() as tmpdir_str:
        tmpdir = Path(tmpdir_str)

        if only in ("all", "talks"):
            _process_talks(
                talks_dir=talks_dir,
                output=talks_out,
                env=env,
                renderer=renderer,
                tmpdir=tmpdir,
                logo_path=logo_path,
                hero_logo_path=hero_logo_path,
                sticker_path=sticker_path,
                no_profile=no_profile,
                static_dir=static_dir,
                public_url_base=public_url_base,
                skip_frontmatter_update=skip_frontmatter_update,
            )

        if only in ("all", "speakers"):
            _process_speakers(
                speakers_dir=speakers_dir,
                output=speakers_out,
                env=env,
                renderer=renderer,
                tmpdir=tmpdir,
                logo_path=logo_path,
                hero_logo_path=hero_logo_path,
                sticker_path=sticker_path,
                no_profile=no_profile,
                static_dir=static_dir,
                public_url_base=public_url_base,
                skip_frontmatter_update=skip_frontmatter_update,
            )


def _build_talk_context(
    md_path: Path,
    *,
    static_dir: Path,
    no_profile: Path,
    logo_url: str,
    hero_logo_url: str,
    sticker_url: str,
) -> dict:
    fm = read_frontmatter(md_path)
    speakers_fm = fm.get("speakers") or []
    speaker_ctx = [
        {
            "name": s.get("name", ""),
            "avatar": _resolve_avatar(s.get("avatar"), static_dir, no_profile),
        }
        for s in speakers_fm
    ]

    is_keynote = str(fm.get("type", "")).lower() == "keynote"
    if is_keynote and speakers_fm:
        title_prefix = "Keynote by"
        title = speakers_fm[0].get("name", "")
        brand_label = "PyOhio 2026"
    else:
        title_prefix = None
        title = str(fm.get("title") or md_path.stem)
        brand_label = "PyOhio 2026 Talk"

    return {
        "title": title,
        "title_prefix": title_prefix,
        "brand_label": brand_label,
        "speakers": speaker_ctx,
        "names": _join_names([s.get("name", "") for s in speakers_fm]),
        "logo_path": logo_url,
        "hero_logo_path": hero_logo_url,
        "sticker_path": sticker_url,
    }


def _build_speaker_context(
    md_path: Path,
    *,
    static_dir: Path,
    no_profile: Path,
    logo_url: str,
    hero_logo_url: str,
    sticker_url: str,
) -> dict:
    fm = read_frontmatter(md_path)
    is_keynote = str(fm.get("speaker_type", "")).lower() == "keynote"
    brand_label = (
        "PyOhio 2026 Keynote Speaker" if is_keynote else "PyOhio 2026 Speaker"
    )
    return {
        "name": str(fm.get("title") or md_path.stem),
        "brand_label": brand_label,
        "avatar_path": _resolve_avatar(fm.get("avatar"), static_dir, no_profile),
        "logo_path": logo_url,
        "hero_logo_path": hero_logo_url,
        "sticker_path": sticker_url,
    }


def _process_talks(
    *,
    talks_dir: Path,
    output: Path,
    env: Environment,
    renderer: OGRenderer,
    tmpdir: Path,
    logo_path: Path,
    hero_logo_path: Path,
    sticker_path: Path,
    no_profile: Path,
    static_dir: Path,
    public_url_base: str,
    skip_frontmatter_update: bool,
) -> None:
    if not talks_dir.exists():
        return

    talk_md_files = [
        p for p in talks_dir.glob("*.md") if p.name not in KEEP_FILES
    ]
    seen_slugs: set[str] = set()
    logo_url = _file_url(logo_path)

    hero_logo_url = _file_url(hero_logo_path)
    sticker_url = _file_url(sticker_path)

    for md_path in sorted(talk_md_files):
        slug = md_path.stem
        seen_slugs.add(slug)
        ctx = _build_talk_context(
            md_path,
            static_dir=static_dir,
            no_profile=no_profile,
            logo_url=logo_url,
            hero_logo_url=hero_logo_url,
            sticker_url=sticker_url,
        )

        html_path = tmpdir / f"talk-{slug}.html"
        _render_html(env, "talk.html", ctx, html_path)

        out_png = output / f"{slug}.png"
        renderer.render(html_path, out_png)
        click.echo(f"  rendered talk {slug}", err=True)

        if not skip_frontmatter_update:
            og_url = f"{public_url_base.rstrip('/')}/talks/{slug}.png"
            update_frontmatter_key(md_path, "og_image", og_url)

    _prune_orphans(output, seen_slugs)


def _process_speakers(
    *,
    speakers_dir: Path,
    output: Path,
    env: Environment,
    renderer: OGRenderer,
    tmpdir: Path,
    logo_path: Path,
    hero_logo_path: Path,
    sticker_path: Path,
    no_profile: Path,
    static_dir: Path,
    public_url_base: str,
    skip_frontmatter_update: bool,
) -> None:
    if not speakers_dir.exists():
        return

    speaker_md_files = [
        p for p in speakers_dir.glob("*.md") if p.name not in KEEP_FILES
    ]
    seen_slugs: set[str] = set()
    logo_url = _file_url(logo_path)

    hero_logo_url = _file_url(hero_logo_path)
    sticker_url = _file_url(sticker_path)

    for md_path in sorted(speaker_md_files):
        slug = md_path.stem
        seen_slugs.add(slug)
        ctx = _build_speaker_context(
            md_path,
            static_dir=static_dir,
            no_profile=no_profile,
            logo_url=logo_url,
            hero_logo_url=hero_logo_url,
            sticker_url=sticker_url,
        )

        html_path = tmpdir / f"speaker-{slug}.html"
        _render_html(env, "speaker.html", ctx, html_path)

        out_png = output / f"{slug}.png"
        renderer.render(html_path, out_png)
        click.echo(f"  rendered speaker {slug}", err=True)

        if not skip_frontmatter_update:
            og_url = f"{public_url_base.rstrip('/')}/speakers/{slug}.png"
            update_frontmatter_key(md_path, "og_image", og_url)

    _prune_orphans(output, seen_slugs)


def preview(
    *,
    slug: str,
    content_dir: Path,
    templates_dir: Path,
    output_dir: Path,
    static_dir: Path,
    write_png: bool = False,
) -> tuple[Path, Path | None]:
    """Render a single talk or speaker OG card for visual iteration.

    Looks up the slug in talks/ first, then speakers/. Writes the rendered
    HTML to <output_dir>/_preview.html (open in browser, refresh after
    template edits). When ``write_png=True``, also screenshots to
    <output_dir>/_preview.png.

    Returns (html_path, png_path or None).
    """
    talks_md = content_dir / "program" / "talks" / f"{slug}.md"
    speakers_md = content_dir / "program" / "speakers" / f"{slug}.md"

    logo_path = static_dir / "img" / "pyohio-square-primary.png"
    hero_logo_path = static_dir / "img" / "pyohio-2026-transparent.png"
    sticker_path = static_dir / "img" / "pyohio-2026-padded-sticker-square.png"
    no_profile = static_dir / "img" / "speakers" / "no-profile.png"
    if not logo_path.exists():
        raise click.UsageError(f"Logo not found at {logo_path}")
    if not hero_logo_path.exists():
        raise click.UsageError(f"Hero logo not found at {hero_logo_path}")
    if not sticker_path.exists():
        raise click.UsageError(f"Sticker not found at {sticker_path}")
    if not no_profile.exists():
        raise click.UsageError(f"Placeholder avatar not found at {no_profile}")

    env = _jinja_env(templates_dir)
    logo_url = _file_url(logo_path)
    hero_logo_url = _file_url(hero_logo_path)
    sticker_url = _file_url(sticker_path)

    if talks_md.exists():
        kind = "talk"
        ctx = _build_talk_context(
            talks_md,
            static_dir=static_dir,
            no_profile=no_profile,
            logo_url=logo_url,
            hero_logo_url=hero_logo_url,
            sticker_url=sticker_url,
        )
        template_name = "talk.html"
    elif speakers_md.exists():
        kind = "speaker"
        ctx = _build_speaker_context(
            speakers_md,
            static_dir=static_dir,
            no_profile=no_profile,
            logo_url=logo_url,
            hero_logo_url=hero_logo_url,
            sticker_url=sticker_url,
        )
        template_name = "speaker.html"
    else:
        raise click.UsageError(
            f"No talk or speaker found with slug '{slug}'. "
            f"Checked {talks_md} and {speakers_md}."
        )

    output_dir.mkdir(parents=True, exist_ok=True)
    html_path = output_dir / "_preview.html"
    _render_html(env, template_name, ctx, html_path)

    png_path: Path | None = None
    if write_png:
        png_path = output_dir / "_preview.png"
        with OGRenderer() as r:
            r.render(html_path, png_path)

    click.echo(f"Rendered {kind} preview for {slug!r}", err=True)
    return html_path, png_path


def _prune_orphans(output: Path, keep_slugs: set[str]) -> None:
    for p in output.glob("*.png"):
        if p.stem not in keep_slugs:
            p.unlink()
            click.echo(f"  pruned orphan {p.name}", err=True)


def _center_crop_square(src: Path, dst: Path, size: int = SQUARE_SIZE) -> None:
    """Crop the center square out of a wide OG card."""
    from PIL import Image  # imported lazily so the dep only loads when used

    with Image.open(src) as img:
        w, h = img.size
        left = max(0, (w - size) // 2)
        top = max(0, (h - size) // 2)
        right = left + size
        bottom = top + size
        cropped = img.crop((left, top, right, bottom))
        dst.parent.mkdir(parents=True, exist_ok=True)
        cropped.save(dst)


def square_crop(
    *,
    content_dir: Path,
    og_source_dir: Path,
    output_dir: Path,
    only: str = "keynotes",
) -> int:
    """Crop existing OG cards into 630×630 squares.

    only:
        "keynotes" — only keynote talks (type: Keynote) and the speakers
                     who present them. A speaker is treated as a keynoter
                     if their `speaker_type` is "keynote" OR if their slug
                     appears in the speakers list of any keynote talk
                     (so this works even when keynote_speaker_codes is
                     unset in pretalx.toml). [default]
        "all"      — every talk and speaker that has an OG card.
    Returns the number of squares written.
    """
    talks_dir = content_dir / "program" / "talks"
    speakers_dir = content_dir / "program" / "speakers"
    talks_src = og_source_dir / "talks"
    speakers_src = og_source_dir / "speakers"
    talks_dst = output_dir / "talks"
    speakers_dst = output_dir / "speakers"

    # First pass: figure out which speakers count as keynoters via the
    # keynote talks' speaker lists.
    keynote_speaker_slugs: set[str] = set()
    if talks_dir.exists():
        for md in talks_dir.glob("*.md"):
            if md.name in KEEP_FILES:
                continue
            fm = read_frontmatter(md)
            if str(fm.get("type", "")).lower() == "keynote":
                for s in fm.get("speakers") or []:
                    if slug := s.get("slug"):
                        keynote_speaker_slugs.add(slug)

    count = 0

    if speakers_dir.exists():
        for md in sorted(speakers_dir.glob("*.md")):
            if md.name in KEEP_FILES:
                continue
            fm = read_frontmatter(md)
            slug = md.stem
            if only == "keynotes":
                is_keynote = (
                    str(fm.get("speaker_type", "")).lower() == "keynote"
                    or slug in keynote_speaker_slugs
                )
                if not is_keynote:
                    continue
            src = speakers_src / f"{slug}.png"
            if not src.exists():
                click.echo(f"  no OG for speaker {slug} (run `og generate` first)", err=True)
                continue
            dst = speakers_dst / f"{slug}.png"
            _center_crop_square(src, dst)
            click.echo(f"  squared speaker {slug}", err=True)
            count += 1

    if talks_dir.exists():
        for md in sorted(talks_dir.glob("*.md")):
            if md.name in KEEP_FILES:
                continue
            fm = read_frontmatter(md)
            if only == "keynotes" and str(fm.get("type", "")).lower() != "keynote":
                continue
            slug = md.stem
            src = talks_src / f"{slug}.png"
            if not src.exists():
                click.echo(f"  no OG for talk {slug} (run `og generate` first)", err=True)
                continue
            dst = talks_dst / f"{slug}.png"
            _center_crop_square(src, dst)
            click.echo(f"  squared talk {slug}", err=True)
            count += 1

    return count
