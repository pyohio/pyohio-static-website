"""Build a speakers/talks CSV for the communications team.

Reads the content metadata Rockgarden exports during a build
(``ROCKGARDEN_CONTENT_JSON``) and writes one row per speaker/talk pairing.
Each speaker's social links are split into named columns by the ``mdi:*``
icon PreTalx assigns them (see ``pretalx/processor.py:_parse_social_link``);
anything unrecognised lands in ``other_links``.
"""

from __future__ import annotations

import csv as csv_module
import json
from pathlib import Path

# icon -> CSV column for the well-known platforms.
ICON_COLUMNS = {
    "mdi:twitter": "twitter_x",
    "mdi:mastodon": "mastodon",
    "mdi:linkedin": "linkedin",
    "mdi:bluesky": "bluesky",
    "mdi:github": "github",
}
OTHER_COLUMN = "other_links"

FIELDNAMES = [
    "speaker_name",
    "speaker_url",
    "talk_name",
    "talk_url",
    "twitter_x",
    "mastodon",
    "linkedin",
    "bluesky",
    "github",
    OTHER_COLUMN,
]


def _abs_url(base_url: str, page_url: str) -> str:
    if not page_url:
        return ""
    if page_url.startswith(("http://", "https://")):
        return page_url
    return base_url.rstrip("/") + "/" + page_url.lstrip("/")


def _url_basename(url: str) -> str:
    """Return the final path segment of a page URL (its slug)."""
    return url.strip("/").rsplit("/", 1)[-1]


def _social_columns(social_links: list | None) -> dict[str, str]:
    """Group social link URLs into CSV columns, joining repeats with ' ; '."""
    grouped: dict[str, list[str]] = {}
    for link in social_links or []:
        if not isinstance(link, dict):
            continue
        url = link.get("url")
        if not url:
            continue
        column = ICON_COLUMNS.get(link.get("icon"), OTHER_COLUMN)
        grouped.setdefault(column, []).append(url)
    return {column: " ; ".join(urls) for column, urls in grouped.items()}


def generate(*, content_json: Path, output: Path, base_url: str) -> int:
    """Write the speakers CSV and return the number of data rows."""
    data = json.loads(content_json.read_text())
    pages = data.get("pages", [])

    # slug -> absolute talk URL, so a speaker's talks resolve to real page URLs.
    talk_urls: dict[str, str] = {}
    for page in pages:
        if (page.get("frontmatter") or {}).get("page_type") == "talk":
            talk_urls[_url_basename(page.get("url", ""))] = _abs_url(
                base_url, page.get("url", "")
            )

    rows: list[dict[str, str]] = []
    for page in pages:
        fm = page.get("frontmatter") or {}
        if fm.get("page_type") != "speaker":
            continue
        if fm.get("listed") is False:
            continue

        base = {
            "speaker_name": page.get("title") or fm.get("title") or "",
            "speaker_url": _abs_url(base_url, page.get("url", "")),
            **_social_columns(fm.get("social_links")),
        }

        talks = fm.get("talks") or []
        if not talks:
            rows.append({**base, "talk_name": "", "talk_url": ""})
            continue
        for talk in talks:
            if not isinstance(talk, dict):
                continue
            slug = talk.get("slug", "")
            rows.append(
                {
                    **base,
                    "talk_name": talk.get("title", ""),
                    "talk_url": talk_urls.get(slug, ""),
                }
            )

    rows.sort(key=lambda r: (r["speaker_name"].lower(), r["talk_name"].lower()))

    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as f:
        writer = csv_module.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        for row in rows:
            writer.writerow({field: row.get(field, "") for field in FIELDNAMES})

    return len(rows)
