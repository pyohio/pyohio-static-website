#!/usr/bin/env python
"""
Utilities for getting data from Pretalx API for PyOhio conference website.
This script fetches talk and speaker data from Pretalx and saves it as YAML and JSON files.
It also downloads speaker avatar images to local storage.
"""

import os
import re
import shutil
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from urllib.parse import urlparse

import click
import httpx
import markdown
import yaml
import orjson
from markdownify import markdownify
from mdx_gfm import GithubFlavoredMarkdownExtension
from slugify import slugify

# Try to use C-based YAML loader/dumper if available
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    pass

# Import custom data (these are referenced but not shown in the original code)
from extra_data import BREAKS, TALK_EXTRAS

# Configuration constants
PRETALX_EVENT_ID = "pyohio-2025"
YEAR = "2025"
DATA_DIR = Path("./2025/src/content")
PLACEHOLDER_AVATAR = "https://www.pyohio.org/no-profile.png"
DEFAULT_AVATAR_PATH = "no-profile.png"
DEFAULT_TIME = "TBD"
PLENARY_ROOM = "TBD"
UNLISTED_SPEAKERS = [
    "DCSCPQ",  # Kattni
]
KEYNOTE_SPEAKERS = [
    "TKWGDL",  # Abigail Mesrenyame Dogbe
    "QJCEWP",  # Jessica Garson
    "UVE988",  # Leon Adato
]


class PretalxClient:
    """Handle Pretalx API requests and data processing."""

    def __init__(self, api_key: str, event_id: str = PRETALX_EVENT_ID):
        """Initialize with API key and event ID."""
        self.api_key = api_key
        self.event_id = event_id
        self.headers = {"Authorization": f"Token {api_key}"}
        self.base_url = f"https://pretalx.com/api/events/{event_id}"

    def get_all_pages(self, url: str) -> List[Dict]:
        """Get all paginated results from an API endpoint."""
        results = []
        response = httpx.get(url, headers=self.headers)
        response.raise_for_status()
        response_json = response.json()
        results.extend(response_json["results"])

        if next_url := response_json.get("next"):
            sub_results = self.get_all_pages(next_url)
            results.extend(sub_results)

        return results

    def get_question_data(self) -> Tuple[Optional[str], Optional[str], List[Dict]]:
        """Get all questions and return IDs for social media and Q&A questions."""
        click.echo("Getting questions...", err=True)
        questions_url = f"{self.base_url}/questions/"
        questions_results = self.get_all_pages(questions_url)

        social_media_question_id = None
        qa_question_id = None

        for question in questions_results:
            if (
                question["question"]["en"] == "Social Media"
                and question["target"] == "speaker"
            ):
                social_media_question_id = question["id"]
            if (
                question["question"]["en"] == "Q & A"
                and question["target"] == "submission"
            ):
                qa_question_id = question["id"]

        click.echo(f"Got {len(questions_results)} questions", err=True)
        return social_media_question_id, qa_question_id, questions_results

    def get_answers_by_question(self, question_id: str) -> Dict[str, str]:
        """Get all answers for a specific question."""
        if not question_id:
            return {}

        answers_url = f"{self.base_url}/answers/?question={question_id}"
        answers_results = self.get_all_pages(answers_url)

        # For social media, key is person code; for Q&A, key is submission code
        result_dict = {}
        for answer in answers_results:
            if "person" in answer:
                result_dict[answer["person"]] = answer["answer"]
            else:
                result_dict[answer["submission"]] = answer["answer"]

        return result_dict

    def get_confirmed_talks(self) -> List[Dict]:
        """Get all confirmed talks/sessions."""
        click.echo("Getting talks...", err=True)
        sessions_url = f"{self.base_url}/submissions/?state=confirmed"
        sessions_results = self.get_all_pages(sessions_url)
        click.echo(f"Got {len(sessions_results)} talks", err=True)
        return sessions_results

    def get_speaker_data(self, speaker_code: str) -> Dict:
        """Get detailed data for a specific speaker."""
        speaker_url = f"{self.base_url}/speakers/{speaker_code}/"
        response = httpx.get(speaker_url, headers=self.headers)
        response.raise_for_status()
        return response.json()


class DataProcessor:
    """Process and save data from Pretalx API."""

    def __init__(
        self, data_dir: Path = DATA_DIR, year: str = YEAR, skip_avatars: bool = False
    ):
        """Initialize with data directory and year."""
        self.data_dir = data_dir
        self.year = year
        self.talks_dir = data_dir / "talks"
        self.speakers_dir = data_dir / "speakers"
        self.json_dir = data_dir / "jsonData"
        self.images_dir = data_dir / "speakers" / "img"
        self.skip_avatars = skip_avatars

        # Ensure directories exist
        for directory in [
            self.talks_dir,
            self.speakers_dir,
            self.json_dir,
            self.images_dir,
        ]:
            directory.mkdir(parents=True, exist_ok=True)

    def clean_directory(self, directory: Path) -> None:
        """Remove all YAML files from the specified directory."""
        click.echo(f"Deleting old files from {directory}...", err=True)
        for f in directory.glob("*.yaml"):
            try:
                f.unlink(missing_ok=True)
            except OSError as e:
                click.echo(f"Error: {f} : {e.strerror}", err=True)

        # Clean the images directory if it's a subdirectory of the speakers directory
        if directory == self.speakers_dir and not self.skip_avatars:
            # Only clean images directory if it exists
            if self.images_dir.exists():
                click.echo("Cleaning speaker images directory...", err=True)

                # Save the placeholder image if it exists
                no_profile = self.images_dir / "no-profile.png"
                has_placeholder = no_profile.exists()
                temp_path = None

                if has_placeholder:
                    temp_path = self.data_dir / "no-profile-temp.png"
                    shutil.copy(no_profile, temp_path)

                # Remove all files in the image directory
                for img_file in self.images_dir.glob("*.*"):
                    try:
                        img_file.unlink(missing_ok=True)
                    except OSError as e:
                        click.echo(
                            f"Error deleting image: {img_file} : {e.strerror}", err=True
                        )

                # Restore the placeholder image if it existed
                if has_placeholder and temp_path and temp_path.exists():
                    shutil.copy(temp_path, no_profile)
                    temp_path.unlink(missing_ok=True)

    def process_talks(
        self, talks: List[Dict], qa_by_talk_code: Dict[str, str]
    ) -> Dict[str, Dict]:
        """Process talk data and save to files."""
        self.clean_directory(self.talks_dir)
        click.echo("Writing talk files...", err=True)

        talks_by_code = {}
        talk_data = []

        # redirects = []

        for talk in talks:
            # Process talk data
            processed_talk = self._process_single_talk(talk, qa_by_talk_code)

            # if processed_talk["old_slug"] != processed_talk["slug"]:
            #     redirects.append(
            #         f"/2025/talks/{processed_talk['old_slug']} /2025/talks/{processed_talk['slug']}"
            #     )
            # Save talk to file
            save_filename = self.talks_dir / f"{processed_talk['slug']}.yaml"
            with open(save_filename, "w") as save_file:
                yaml.dump(processed_talk, save_file, allow_unicode=True)

            # Add to return collections
            talks_by_code[talk["code"]] = processed_talk

            # Add extra fields for JSON export
            json_talk = processed_talk.copy()
            json_talk["description_text"] = (
                markdownify(json_talk["description"])
                .replace("<", "")
                .replace(">", "")
                .replace("\n\n\n", "\n\n")
            )

            if talk_slug := json_talk.get("slug"):
                json_talk["talk_url"] = (
                    f"https://www.pyohio.org/{self.year}/talks/{talk_slug}"
                )

            json_talk["speaker_names"] = ", ".join(
                [s["name"] for s in json_talk["speakers"]]
            )
            json_talk["description_youtube"] = (
                f"{json_talk['type']} by {json_talk['speaker_names']} at PyOhio {self.year}:\n"
                f"{json_talk['description_text']}PyOhio talk listing: {json_talk['talk_url']}"
            )

            talk_data.append(json_talk)

        # Write talk data to JSON
        click.echo("Writing talk data JSON...", err=True)
        self._write_json(talk_data, "talks.json", self.json_dir)

        click.echo("Redirects:", err=True)
        for redirect in redirects:
            click.echo(redirect, err=True)

        return talks_by_code

    def _process_single_talk(self, talk: Dict, qa_by_talk_code: Dict[str, str]) -> Dict:
        """Process a single talk entry."""
        speakers = [
            {
                "name": s["name"],
                "avatar": s["avatar"],
                "code": s["code"],
                "slug": slugify(s["name"]),
            }
            for s in talk["speakers"]
        ]

        # Get basic talk data
        processed_talk = {
            "code": talk["code"],
            "title": talk["title"],
            "slug": slugify(
                re.split(r"\?|\.|:", talk["title"])[0],
                word_boundary=True,
                max_length=64,
            ),
            # "old_slug": slugify(
            #     re.split(r"\?|\.", talk["title"])[0],
            #     word_boundary=True,
            #     max_length=64,
            # ),
            "description": markdown.markdown(
                talk["description"],
                extensions=[GithubFlavoredMarkdownExtension(), "footnotes"],
            ),
            "start_time": talk.get("slot", {}).get("start", DEFAULT_TIME)
            if talk.get("slot", {}) is not None
            else DEFAULT_TIME,
            "end_time": talk.get("slot", {}).get("end", DEFAULT_TIME)
            if talk.get("slot", {}) is not None
            else DEFAULT_TIME,
            "room": talk.get("slot", {}).get("room", {}).get("en", "TBD")
            if talk.get("slot", {}) is not None
            else "TBD",
            "duration": talk["duration"],
            "speakers": speakers,
            "type": talk["submission_type"]["en"],
        }

        # Special handling for keynotes and plenary sessions
        if processed_talk["type"] in ["Keynote", "Plenary Session"]:
            processed_talk["room"] = PLENARY_ROOM

        if processed_talk["type"] == "Keynote":
            processed_talk["slug"] = f"{processed_talk['speakers'][0]['slug']}-keynote"

        # Q&A handling
        if qa_by_talk_code.get(talk["code"], "False") != "False":
            processed_talk["qna"] = True
            processed_talk["qna_channel"] = re.split(r":|\?|\.", talk["title"])[0]
        else:
            processed_talk["qna"] = False
            processed_talk["qna_channel"] = None

        # Add extra data from TALK_EXTRAS
        extras = TALK_EXTRAS.get(talk["code"], {})
        processed_talk["youtube_url"] = extras.get("youtube_url")
        processed_talk["content_warnings"] = extras.get("content_warnings")
        processed_talk["discord_channel_id"] = extras.get("channel_id", "")
        processed_talk["stream_timestamp"] = extras.get("video_start_time", "")

        return processed_talk

    def download_avatar(self, avatar_url: str, speaker_slug: str) -> str:
        """
        Download avatar image and save to images directory.
        Returns the relative path to the saved image.
        """
        if self.skip_avatars:
            # Check if avatar already exists
            for ext in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
                image_path = self.images_dir / f"{speaker_slug}{ext}"
                if image_path.exists():
                    return f"{speaker_slug}{ext}"
            # If no existing avatar found, return default
            return DEFAULT_AVATAR_PATH

        if not avatar_url or avatar_url == PLACEHOLDER_AVATAR:
            return DEFAULT_AVATAR_PATH

        # Add size parameter for Gravatar URLs
        if avatar_url.startswith("https://www.gravatar.com/avatar"):
            avatar_url = f"{avatar_url}?s=300"

        try:
            # Get file extension from URL or default to .png
            parsed_url = urlparse(avatar_url)
            path = parsed_url.path
            extension = os.path.splitext(path)[1].lower()
            if not extension or extension not in [
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".webp",
            ]:
                extension = ".png"

            # Create image filename
            image_filename = f"{speaker_slug}{extension}"
            image_path = self.images_dir / image_filename
            relative_path = f"{image_filename}"

            # Download the image
            response = httpx.get(avatar_url, follow_redirects=True, timeout=10.0)
            response.raise_for_status()

            # Save image to file
            with open(image_path, "wb") as img_file:
                img_file.write(response.content)

            click.echo(f"Downloaded avatar for {speaker_slug}", err=True)
            return relative_path

        except Exception as e:
            click.echo(f"Error downloading avatar for {speaker_slug}: {e}", err=True)
            return DEFAULT_AVATAR_PATH

    def process_speakers(
        self,
        speaker_codes: List[str],
        client: PretalxClient,
        talks_by_code: Dict[str, Dict],
        social_media_by_speaker_code: Dict[str, str],
    ) -> None:
        """Process speaker data and save to files."""
        self.clean_directory(self.speakers_dir)
        click.echo("Getting speaker info...", err=True)

        speaker_data = []
        for speaker_code in speaker_codes:
            speaker_info = client.get_speaker_data(speaker_code)
            speaker_data.append(speaker_info)

        click.echo("Writing speaker files...", err=True)
        for speaker in speaker_data:
            processed_speaker = self._process_single_speaker(
                speaker, talks_by_code, social_media_by_speaker_code
            )

            save_filename = self.speakers_dir / f"{processed_speaker['slug']}.yaml"
            with open(save_filename, "w") as save_file:
                yaml.dump(processed_speaker, save_file, allow_unicode=True)

    def _process_single_speaker(
        self,
        speaker: Dict,
        talks_by_code: Dict[str, Dict],
        social_media_by_speaker_code: Dict[str, str],
    ) -> Dict:
        """Process a single speaker entry."""
        if speaker["biography"] is None:
            speaker["biography"] = ""

        # Get slug first since we need it for the avatar
        speaker_slug = slugify(speaker["name"])

        # Save original avatar URL
        avatar_url = speaker["avatar"] or PLACEHOLDER_AVATAR

        # Download avatar and get relative path
        avatar_path = self.download_avatar(avatar_url, speaker_slug)

        # Process basic speaker data
        processed_speaker = {
            "name": speaker["name"],
            "slug": speaker_slug,
            "code": speaker["code"],
            "avatar": avatar_path,
            "avatar_url": avatar_url,
            "listed": True,
            "biography": markdown.markdown(
                speaker["biography"],
                extensions=[GithubFlavoredMarkdownExtension(), "footnotes"],
            ),
        }

        # Get talks by this speaker
        speaker_talks = []
        for talk_code in speaker["submissions"]:
            if talk_code in talks_by_code:
                talk = {
                    "code": talk_code,
                    "slug": talks_by_code[talk_code]["slug"],
                    "title": talks_by_code[talk_code]["title"],
                }
                speaker_talks.append(talk)

        processed_speaker["talks"] = speaker_talks

        # For imported avatar URLs, ensure the default placeholder image exists
        if not os.path.exists(self.images_dir / "no-profile.png"):
            placeholder_src = (
                DATA_DIR.parent.parent / "static" / "img" / "no-profile.png"
            )

            # First check if the placeholder exists in the static directory
            if placeholder_src.exists():
                # Copy the existing placeholder image
                shutil.copy(placeholder_src, self.images_dir / "no-profile.png")
                click.echo(
                    f"Copied existing placeholder image from {placeholder_src}",
                    err=True,
                )
            else:
                # Try to download the placeholder from the URL
                try:
                    response = httpx.get(
                        PLACEHOLDER_AVATAR, follow_redirects=True, timeout=10.0
                    )
                    if response.status_code == 200:
                        with open(self.images_dir / "no-profile.png", "wb") as img_file:
                            img_file.write(response.content)
                        click.echo("Downloaded no-profile.png image", err=True)
                except Exception as e:
                    click.echo(f"Error downloading placeholder image: {e}", err=True)

        # Process social links
        social_links = [
            link.strip()
            for link in social_media_by_speaker_code.get(
                processed_speaker["code"], ""
            ).split(",")
            if link.strip()
        ]

        social_data = []
        for social_link in social_links:
            try:
                social_link_data = self._parse_social_link(social_link)
                social_data.append(social_link_data)
            except ValueError as e:
                click.echo(
                    f"Error parsing social link for {processed_speaker['name']}: {e}",
                    err=True,
                )

        processed_speaker["social_links"] = social_data

        # Set speaker type
        processed_speaker["speaker_type"] = "speaker"

        # Special handling for unlisted speakers (organizers)
        if processed_speaker["code"] in UNLISTED_SPEAKERS:
            processed_speaker["listed"] = False
            processed_speaker["speaker_type"] = "organizer"

        # Special handling for keynote speakers
        if processed_speaker["code"] in KEYNOTE_SPEAKERS:
            processed_speaker["speaker_type"] = "keynote"
            processed_speaker["keynote_index"] = KEYNOTE_SPEAKERS.index(
                processed_speaker["code"]
            )

        return processed_speaker

    def _parse_social_link(self, social_link: str) -> Dict[str, Optional[str]]:
        """Parse a social media link and return structured data."""
        if social_link is None:
            raise ValueError("Social link is None")

        if not (
            social_link.startswith("http://") or social_link.startswith("https://")
        ):
            raise ValueError(f"Invalid social link format: {social_link}")

        # Default values
        result = {
            "social_link_url": social_link,
            "social_link_display": social_link.replace("https://", ""),
            "social_link_type": "mdi:link-variant",
        }

        # Twitter/X
        if social_link.startswith("https://twitter.com/"):
            result["social_link_display"] = social_link.replace(
                "https://twitter.com/", "@"
            )
            result["social_link_type"] = "mdi:twitter"
        elif social_link.startswith("https://x.com/"):
            result["social_link_display"] = social_link.replace("https://x.com/", "@")
            result["social_link_type"] = "mdi:twitter"
        # LinkedIn
        elif social_link.startswith(
            "https://linkedin.com/in/"
        ) or social_link.startswith("https://www.linkedin.com/in/"):
            result["social_link_display"] = social_link.replace(
                "https://www.", ""
            ).replace("https://", "")
            result["social_link_type"] = "mdi:linkedin"
        # Medium
        elif social_link.startswith("https://medium.com/@"):
            result["social_link_type"] = "mdi:link-variant"
        # GitHub
        elif social_link.startswith("https://github.com"):
            result["social_link_type"] = "mdi:github"
        # Mastodon (matches pattern like https://instance.tld/@username)
        elif re.match(r"https://.*\..*@.*", social_link):
            mastodon_instance, mastodon_username = social_link.replace(
                "https://", ""
            ).split("/@")
            result["social_link_display"] = f"@{mastodon_username}@{mastodon_instance}"
            result["social_link_type"] = "mdi:mastodon"

        return result

    def process_breaks(self) -> None:
        """Process break data and save to files."""
        click.echo("Writing break files...", err=True)
        for break_code, break_data in BREAKS.items():
            save_filename = self.talks_dir / f"{break_code.lower()}.yaml"
            with open(save_filename, "w") as save_file:
                yaml.dump(break_data, save_file, allow_unicode=True)

    def _write_json(self, data: Any, filename: str, path: Path) -> None:
        """Write data to a JSON file."""
        outfile_name = path / filename
        with open(outfile_name, "wb") as outfile:
            outfile.write(orjson.dumps(data, option=orjson.OPT_INDENT_2))


@click.group()
@click.pass_context
def pretalx(ctx):
    """Utilities for getting data from Pretalx"""
    ctx.obj = {}
    try:
        ctx.obj["api_key"] = os.environ["PRETALX_API_KEY"]
    except KeyError:
        click.echo(
            "Environment variable must be set to interact with Pretalx: PRETALX_API_KEY"
        )
        raise click.Abort()

    if not Path(".projectroot").is_file():
        click.echo(
            "File not found: .projectroot\n"
            "Make sure this command is run from the project root and not ./scripts!"
        )
        raise click.Abort()


@pretalx.command()
@click.option(
    "--skip-avatars",
    is_flag=True,
    help="Skip deleting and downloading avatar images",
)
@click.pass_context
def get_event_data(ctx, skip_avatars):
    """Get session and speaker data from Pretalx"""
    api_key = ctx.obj["api_key"]

    # Initialize client and processor
    client = PretalxClient(api_key, PRETALX_EVENT_ID)
    processor = DataProcessor(DATA_DIR, YEAR, skip_avatars=skip_avatars)

    # Get questions data
    social_media_question_id, qa_question_id, _ = client.get_question_data()

    # Get answers data
    click.echo("Getting answers...", err=True)
    social_media_by_speaker_code = client.get_answers_by_question(
        social_media_question_id
    )
    qa_by_talk_code = client.get_answers_by_question(qa_question_id)

    # Get and process talks
    talks = client.get_confirmed_talks()
    talks_by_code = processor.process_talks(talks, qa_by_talk_code)

    # Get unique speaker codes
    speaker_codes = set()
    for talk in talks:
        for speaker in talk["speakers"]:
            speaker_codes.add(speaker["code"])

    # Process speakers
    processor.process_speakers(
        list(speaker_codes), client, talks_by_code, social_media_by_speaker_code
    )

    # Process breaks
    processor.process_breaks()


@pretalx.command()
def make_talk_extras():
    """Generate talk extras data for the TALK_EXTRAS dictionary and print to stdout."""
    # Initialize the data processor for access to data directories
    processor = DataProcessor(DATA_DIR, YEAR)
    talks_dir = processor.talks_dir

    click.echo(f"Reading talk YAML files from {talks_dir}...", err=True)

    # Dictionary to store talk extras
    talk_extras = {}

    # Read each YAML file in the talks directory
    for talk_file in talks_dir.glob("*.yaml"):
        try:
            # Skip break files (they don't have talk codes)
            if talk_file.stem in [b.lower() for b in BREAKS.keys()]:
                continue

            with open(talk_file, "r") as f:
                talk_data = yaml.safe_load(f)

            # Only process files that have a talk code
            if "code" in talk_data:
                talk_extras[talk_data["code"]] = {
                    "title": talk_data["title"],
                    "youtube_url": None,
                    "content_warnings": None,
                    "channel_id": "",
                    "channel_name": "",
                    "video_start_time": "",
                }
        except Exception as e:
            click.echo(f"Error processing {talk_file}: {e}", err=True)

    # Print JSON to stdout using orjson
    json_bytes = orjson.dumps(
        talk_extras, option=orjson.OPT_INDENT_2 | orjson.OPT_SORT_KEYS
    )
    print(json_bytes.decode("utf-8"))


if __name__ == "__main__":
    pretalx()
