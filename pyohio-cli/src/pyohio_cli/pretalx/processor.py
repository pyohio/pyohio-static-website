"""Process PreTalx data into Rockgarden content files."""

from __future__ import annotations

import io
import re
from pathlib import Path

import click
import markdown as md
from mdx_gfm import GithubFlavoredMarkdownExtension
from slugify import slugify

from pyohio_cli._frontmatter import update_frontmatter_key, yaml_loader
from pyohio_cli.pretalx.avatars import AvatarDownloader
from pyohio_cli.pretalx.client import PretalxClient
from pyohio_cli.pretalx.config import PretalxConfig
from pyohio_cli.pretalx.schedule import build_schedule

KEEP_FILES = {"index.md", "_folder.md"}


def _md_to_html(text: str) -> str:
    return md.markdown(text or "", extensions=[GithubFlavoredMarkdownExtension(), "footnotes"])


def _talk_slug(title: str) -> str:
    return slugify(re.split(r"\?|\.|:", title)[0], word_boundary=True, max_length=64)


def _parse_social_link(link: str) -> dict:
    if not (link.startswith("http://") or link.startswith("https://")):
        raise ValueError(f"Invalid social link: {link!r}")

    result = {
        "url": link,
        "display": link.replace("https://", "").replace("http://", ""),
        "icon": "mdi:link-variant",
    }

    if link.startswith("https://twitter.com/"):
        result["display"] = link.replace("https://twitter.com/", "@")
        result["icon"] = "mdi:twitter"
    elif link.startswith("https://x.com/"):
        result["display"] = link.replace("https://x.com/", "@")
        result["icon"] = "mdi:twitter"
    elif link.startswith(("https://linkedin.com/in/", "https://www.linkedin.com/in/")):
        result["display"] = link.replace("https://www.", "").replace("https://", "")
        result["icon"] = "mdi:linkedin"
    elif link.startswith("https://github.com"):
        result["icon"] = "mdi:github"
    elif link.startswith("https://bsky.app/profile/"):
        result["display"] = link.replace("https://bsky.app/profile/", "@")
        result["icon"] = "mdi:bluesky"
    elif re.match(r"https://[^/]+/@[^/]+$", link):
        host, username = link.replace("https://", "").split("/@", 1)
        result["display"] = f"@{username}@{host}"
        result["icon"] = "mdi:mastodon"

    return result


class DataProcessor:
    def __init__(
        self,
        config: PretalxConfig,
        content_dir: Path,
        avatar_downloader: AvatarDownloader,
    ):
        self.config = config
        self.content_dir = content_dir
        self.avatars = avatar_downloader
        self.talks_dir = content_dir / "program" / "talks"
        self.speakers_dir = content_dir / "program" / "speakers"
        self.talks_index = self.talks_dir / "index.md"
        self.speakers_index = self.speakers_dir / "index.md"
        self.keynote_page = content_dir / "program" / "keynote-speakers.md"
        self.schedule_page = content_dir / "program" / "schedule.md"

    def clean_generated_pages(self) -> None:
        """Remove previously generated talk/speaker markdown files (keep index/folder)."""
        for d in (self.talks_dir, self.speakers_dir):
            if not d.exists():
                continue
            for path in d.glob("*.md"):
                if path.name not in KEEP_FILES:
                    path.unlink()

    def write_talk(self, talk: dict, qa_by_code: dict[str, str]) -> dict:
        title = talk["title"]
        is_keynote = talk["submission_type"]["name"]["en"] == "Keynote"

        if is_keynote and talk["speakers"]:
            speaker_slug = slugify(talk["speakers"][0]["name"])
            slug = f"{speaker_slug}-keynote"
        else:
            slug = _talk_slug(title)

        speakers_data = []
        for s in talk["speakers"]:
            speaker_slug = slugify(s["name"])
            entry = {
                "name": s["name"],
                "slug": speaker_slug,
                "code": s["code"],
            }
            avatar_path = self.avatars.fetch(s.get("avatar_url"), speaker_slug)
            if avatar_path:
                entry["avatar"] = avatar_path
            speakers_data.append(entry)

        qa_answer = qa_by_code.get(talk["code"], "False")
        qna = qa_answer not in ("False", "false", "", None)

        frontmatter = {
            "title": title,
            "page_type": "talk",
            "code": talk["code"],
            "duration": talk["duration"],
            "type": talk["submission_type"]["name"]["en"],
            "qna": qna,
            "qna_channel": re.split(r":|\?|\.", title)[0] if qna else None,
            "speakers": speakers_data,
        }

        body = (talk.get("description") or "").strip()
        self._write_markdown(self.talks_dir / f"{slug}.md", frontmatter, body)

        return {
            "code": talk["code"],
            "slug": slug,
            "title": title,
            "type": frontmatter["type"],
            "speakers": speakers_data,
        }

    def write_speaker(
        self,
        speaker: dict,
        talks_by_code: dict[str, dict],
        social_by_code: dict[str, str],
    ) -> dict | None:
        code = speaker["code"]
        name = speaker["name"]
        slug = slugify(name)

        avatar_path = self.avatars.fetch(speaker.get("avatar_url"), slug)

        speaker_talks = []
        for talk_code in speaker.get("submissions", []):
            if talk_code in talks_by_code:
                speaker_talks.append(talks_by_code[talk_code])

        speaker_type = "speaker"
        keynote_index = None
        if code in self.config.keynote_speaker_codes:
            speaker_type = "keynote"
            keynote_index = self.config.keynote_speaker_codes.index(code)
        elif code in self.config.unlisted_speaker_codes:
            speaker_type = "organizer"

        social_links = []
        for raw in (social_by_code.get(code) or "").split(","):
            raw = raw.strip()
            if not raw:
                continue
            try:
                social_links.append(_parse_social_link(raw))
            except ValueError as e:
                click.echo(f"  social link skipped for {name}: {e}", err=True)

        frontmatter = {
            "title": name,
            "page_type": "speaker",
            "code": code,
            "speaker_type": speaker_type,
            "listed": code not in self.config.unlisted_speaker_codes,
            "talks": speaker_talks,
            "social_links": social_links,
        }
        if avatar_path:
            frontmatter["avatar"] = avatar_path
        if keynote_index is not None:
            frontmatter["keynote_index"] = keynote_index

        body = (speaker.get("biography") or "").strip()
        self._write_markdown(self.speakers_dir / f"{slug}.md", frontmatter, body)

        return {
            "name": name,
            "slug": slug,
            "code": code,
            "speaker_type": speaker_type,
            "keynote_index": keynote_index,
            "avatar": avatar_path,
            "biography": body,
            "listed": code not in self.config.unlisted_speaker_codes,
        }

    def update_keynote_page(self, keynote_records: list[dict]) -> None:
        """Rewrite the `keynoters:` frontmatter list on keynote-speakers.md."""
        ordered = sorted(
            (r for r in keynote_records if r.get("keynote_index") is not None),
            key=lambda r: r["keynote_index"],
        )
        keynoters = [
            {
                "name": r["name"],
                "slug": r["slug"],
                "avatar": r.get("avatar"),
                "biography_html": _md_to_html(r.get("biography") or ""),
            }
            for r in ordered
        ]
        update_frontmatter_key(self.keynote_page, "keynoters", keynoters)

    def update_schedule_page(
        self,
        slots: list[dict],
        talks_by_code: dict[str, dict],
    ) -> None:
        """Populate the `schedule:` grid on schedule.md from PreTalx slots."""
        days = build_schedule(slots, talks_by_code)
        update_frontmatter_key(self.schedule_page, "schedule", days)

    def update_talks_index(
        self,
        talk_records: list[dict],
        talks_by_code: dict[str, dict],
        speakers_by_code: dict[str, dict],
    ) -> None:
        """Populate `talks:` list on talks/index.md for listing rendering.

        Keynotes are excluded; they're surfaced on the keynote-speakers page.
        """
        entries = []
        for record in talk_records:
            if record.get("type") == "Keynote":
                continue
            speakers = []
            for s in record.get("speakers", []):
                speakers.append({"name": s["name"], "slug": s["slug"]})
            entries.append(
                {
                    "slug": record["slug"],
                    "title": record["title"],
                    "type": record.get("type", ""),
                    "speakers": speakers,
                }
            )
        entries.sort(key=lambda e: e["title"].lower())
        update_frontmatter_key(self.talks_index, "talks", entries)

    def update_speakers_index(self, speaker_records: list[dict]) -> None:
        """Populate `speakers:` list on speakers/index.md for listing rendering."""
        entries = []
        for r in speaker_records:
            if not r.get("listed", True):
                continue
            entries.append(
                {
                    "name": r["name"],
                    "slug": r["slug"],
                    "avatar": r.get("avatar"),
                }
            )
        entries.sort(key=lambda e: e["name"].lower())
        update_frontmatter_key(self.speakers_index, "speakers", entries)

    def _write_markdown(self, path: Path, frontmatter: dict, body: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        yaml = yaml_loader()
        buf = io.StringIO()
        yaml.dump(frontmatter, buf)
        fm_text = buf.getvalue()
        if not fm_text.endswith("\n"):
            fm_text += "\n"
        body = body.rstrip() + "\n" if body else ""
        path.write_text(f"---\n{fm_text}---\n\n{body}")


def run_fetch(
    *,
    api_key: str,
    config: PretalxConfig,
    content_dir: Path,
    avatar_cache_dir: Path,
    avatar_output_dir: Path,
    avatar_public_prefix: str,
    skip_avatars: bool,
    verbose: bool,
) -> None:
    client = PretalxClient(api_key, config.event_id, verbose=verbose)
    avatars = AvatarDownloader(
        avatar_cache_dir,
        avatar_output_dir,
        avatar_public_prefix,
        skip=skip_avatars,
    )
    processor = DataProcessor(config, content_dir, avatars)

    social_q, qa_q = client.get_questions()
    click.echo("Getting answers...", err=True)
    social_by_code = client.get_answers_by_question(social_q)
    qa_by_code = client.get_answers_by_question(qa_q)

    submissions = client.get_confirmed_submissions()

    allowed_keynoters = set(config.keynote_speaker_codes)
    filtered_submissions = []
    skipped_keynotes = 0
    for sub in submissions:
        is_keynote = sub["submission_type"]["name"]["en"] == "Keynote"
        if is_keynote:
            speaker_codes_on_talk = {s["code"] for s in sub["speakers"]}
            if not (speaker_codes_on_talk & allowed_keynoters):
                skipped_keynotes += 1
                continue
        filtered_submissions.append(sub)
    if skipped_keynotes:
        click.echo(
            f"Skipped {skipped_keynotes} unannounced keynote(s); "
            "add speaker codes to keynote_speaker_codes to publish.",
            err=True,
        )
    submissions = filtered_submissions

    processor.clean_generated_pages()

    click.echo("Writing talk pages...", err=True)
    talks_by_code: dict[str, dict] = {}
    for talk in submissions:
        record = processor.write_talk(talk, qa_by_code)
        talks_by_code[record["code"]] = record

    speaker_codes: list[str] = []
    seen: set[str] = set()
    for talk in submissions:
        for s in talk["speakers"]:
            if s["code"] not in seen:
                seen.add(s["code"])
                speaker_codes.append(s["code"])

    click.echo(f"Writing {len(speaker_codes)} speaker pages...", err=True)
    keynote_records: list[dict] = []
    speaker_records: list[dict] = []
    for code in speaker_codes:
        speaker = client.get_speaker(code)
        record = processor.write_speaker(speaker, talks_by_code, social_by_code)
        if not record:
            continue
        speaker_records.append(record)
        if record.get("speaker_type") == "keynote":
            keynote_records.append(record)

    click.echo("Updating listing pages...", err=True)
    processor.update_talks_index(
        list(talks_by_code.values()),
        talks_by_code,
        {r["code"]: r for r in speaker_records},
    )
    processor.update_speakers_index(speaker_records)
    processor.update_keynote_page(keynote_records)

    click.echo("Updating schedule grid...", err=True)
    slots = client.get_slots()
    processor.update_schedule_page(slots, talks_by_code)
