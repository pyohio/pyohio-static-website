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
UNLISTED_SPEAKERS = [
    "DCSCPQ",  # Kattni
]
KEYNOTE_SPEAKERS = [
    "TKWGDL",  # Abigail Mesrenyame Dogbe
    "QJCEWP",  # Jessica Garson
    "UVE988",  # Leon Adato
]


def generate_deterministic_break_code(start_time: str, title: str) -> str:
    """
    Generate a deterministic break code based on start time and title.
    Format: BREAK_DAY_HHMM (e.g., BREAK_SAT_1030)
    """
    from datetime import datetime

    # Parse the ISO datetime
    dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))

    # Get day abbreviation and time
    day_abbr = dt.strftime("%a").upper()
    time_str = dt.strftime("%H%M")

    return f"BREAK_{day_abbr}_{time_str}"


class PretalxClient:
    """Handle Pretalx API requests and data processing."""

    def __init__(
        self, api_key: str, event_id: str = PRETALX_EVENT_ID, verbose: bool = False
    ):
        """Initialize with API key and event ID."""
        self.api_key = api_key
        self.event_id = event_id
        self.headers = {"Authorization": f"Token {api_key}", "Pretalx-Version": "v1"}
        self.base_url = f"https://pretalx.com/api/events/{event_id}"
        self.verbose = verbose

    def get_all_pages(self, url: str) -> List[Dict]:
        """Get all paginated results from an API endpoint."""
        results = []
        response = httpx.get(url, headers=self.headers)
        try:
            response.raise_for_status()
        except httpx.HTTPStatusError as e:
            click.echo(f"HTTP Error {response.status_code}: {response.text}", err=True)
            raise
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
        sessions_url = f"{self.base_url}/submissions/?state=confirmed&expand=speakers,submission_type"
        sessions_results = self.get_all_pages(sessions_url)
        click.echo(f"Got {len(sessions_results)} talks", err=True)
        return sessions_results

    def get_rooms(self) -> Dict[int, str]:
        """Get room data and return a lookup dict of room_id -> room_name."""
        if self.verbose:
            click.echo("Getting room data...", err=True)
        rooms_url = f"{self.base_url}/rooms/"
        rooms_results = self.get_all_pages(rooms_url)

        rooms_lookup = {}
        for room in rooms_results:
            room_id = room["id"]
            # Handle room name - it might be a string or a dict with language keys
            room_name = room.get("name")
            if isinstance(room_name, dict):
                room_name = room_name.get("en", f"Room-{room_id}")
            elif not room_name:
                room_name = f"Room-{room_id}"

            rooms_lookup[room_id] = room_name
            if self.verbose:
                click.echo(f"DEBUG: Room {room_id}: {room_name}", err=True)

        if self.verbose:
            click.echo(f"Got {len(rooms_lookup)} rooms", err=True)
        return rooms_lookup

    def get_schedule_data(self) -> Tuple[Dict[str, Dict], List[Dict]]:
        """Get schedule data for all talks and break/session data."""
        click.echo("Getting schedule data...", err=True)
        schedule_url = f"{self.base_url}/schedules/latest/"
        response = httpx.get(schedule_url, headers=self.headers)
        response.raise_for_status()
        schedule_data = response.json()

        # Get room data for name lookup
        rooms_lookup = self.get_rooms()

        # Debug: Print the structure of the response
        if self.verbose:
            click.echo(
                f"DEBUG: Schedule has {len(schedule_data.get('slots', []))} slots",
                err=True,
            )

        # Extract schedule data by fetching individual slots
        schedule_lookup = {}
        break_sessions_raw = []  # Collect all breaks before deduplicating
        slot_ids = schedule_data.get("slots", [])

        for i, slot_id in enumerate(slot_ids):
            if self.verbose and i < 10:  # Debug first few slots
                click.echo(f"DEBUG: Fetching slot {slot_id}...", err=True)

            try:
                slot_url = f"{self.base_url}/slots/{slot_id}/"
                slot_response = httpx.get(slot_url, headers=self.headers)
                slot_response.raise_for_status()
                slot_data = slot_response.json()

                if self.verbose and i < 10:  # Debug first few slots
                    click.echo(f"DEBUG: Slot {slot_id} data: {slot_data}", err=True)

                # Handle room - it might be an ID or an object
                room_info = slot_data.get("room")
                if isinstance(room_info, int):
                    # Room is an ID, look it up in rooms_lookup
                    room_name = rooms_lookup.get(room_info, f"Room-{room_info}")
                elif isinstance(room_info, dict):
                    room_name = (
                        room_info.get("name", {}).get("en", "TBD")
                        if room_info.get("name")
                        else "TBD"
                    )
                else:
                    room_name = "TBD"

                # Extract submission code and schedule info for talks
                if "submission" in slot_data and slot_data["submission"]:
                    submission_code = slot_data["submission"]

                    schedule_lookup[submission_code] = {
                        "start_time": slot_data.get("start"),
                        "end_time": slot_data.get("end"),
                        "room": room_name,
                        "room_id": room_info if isinstance(room_info, int) else None,
                    }

                    if (
                        self.verbose and i < 10
                    ):  # Debug first few successful submissions
                        click.echo(
                            f"DEBUG: Added schedule for submission {submission_code}: {schedule_lookup[submission_code]}",
                            err=True,
                        )

                # Extract break/session data for slots without submissions
                elif "description" in slot_data and slot_data["description"]:
                    description = slot_data["description"]
                    title = (
                        description.get("en", "Break")
                        if isinstance(description, dict)
                        else str(description)
                    )

                    # Create a break/session entry (will be deduplicated later)
                    break_entry = {
                        "title": title,
                        "start_time": slot_data.get("start"),
                        "end_time": slot_data.get("end"),
                        "room": room_name,
                        "room_id": room_info if isinstance(room_info, int) else None,
                        "duration": slot_data.get("duration", 15),
                        "slot_id": slot_data["id"],
                    }

                    break_sessions_raw.append(break_entry)

                    if self.verbose and i < 10:
                        click.echo(
                            f"DEBUG: Found break session: {break_entry['title']} at {break_entry['start_time']}",
                            err=True,
                        )

            except Exception as e:
                if self.verbose:
                    click.echo(f"DEBUG: Error fetching slot {slot_id}: {e}", err=True)
                continue

        # Deduplicate only actual breaks (not opening/closing remarks)
        break_groups = {}
        non_break_sessions = []

        for break_entry in break_sessions_raw:
            title = break_entry["title"]
            # Only deduplicate entries with "break" in the title
            if "break" in title.lower():
                key = (title, break_entry["start_time"])
                if key not in break_groups:
                    break_groups[key] = break_entry
                # If multiple rooms have the same break, just keep the first one
            else:
                # Keep opening/closing remarks with their actual rooms
                non_break_sessions.append(break_entry)

        # Create final break sessions with unique slugs
        break_sessions = []
        break_title_counts = {}

        # Process deduplicated breaks
        for (title, start_time), break_entry in break_groups.items():
            # Track duplicate titles and create unique slugs
            if title in break_title_counts:
                break_title_counts[title] += 1
                unique_slug = f"{slugify(title.lower())}{break_title_counts[title]}"
            else:
                break_title_counts[title] = 1
                unique_slug = f"{slugify(title.lower())}{break_title_counts[title]}"

            # Create final break entry
            final_break = {
                "title": title,
                "start_time": start_time,
                "end_time": break_entry["end_time"],
                "room": "n/a",  # Breaks span all rooms
                "room_id": None,
                "duration": break_entry["duration"],
                "type": "Break",  # Default type
                "slug": unique_slug,
                "code": generate_deterministic_break_code(start_time, title),
                "speakers": [],
                "description": "",
            }

            # Determine specific break type
            if "lunch" in title.lower():
                final_break["type"] = "Lunch Break"

            break_sessions.append(final_break)

        # Process non-break sessions (opening/closing remarks) with their actual rooms
        for session in non_break_sessions:
            title = session["title"]

            # Track duplicate titles and create unique slugs
            if title in break_title_counts:
                break_title_counts[title] += 1
                unique_slug = f"{slugify(title.lower())}{break_title_counts[title]}"
            else:
                break_title_counts[title] = 1
                unique_slug = f"{slugify(title.lower())}{break_title_counts[title]}"

            # Create session entry with actual room
            final_session = {
                "title": title,
                "start_time": session["start_time"],
                "end_time": session["end_time"],
                "room": session["room"],  # Keep actual room
                "room_id": session["room_id"],
                "duration": session["duration"],
                "type": "Plenary Session",
                "slug": unique_slug,
                "code": generate_deterministic_break_code(session["start_time"], title),
                "speakers": [],
                "description": "",
            }

            break_sessions.append(final_session)

        if self.verbose:
            click.echo(
                f"DEBUG: Created {len(break_sessions)} final break/session entries",
                err=True,
            )

        click.echo(
            f"Got schedule data for {len(schedule_lookup)} talks and {len(break_sessions)} break sessions",
            err=True,
        )
        return schedule_lookup, break_sessions

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
        self.avatar_cache_dir = Path("./scripts/avatar_cache")
        self.skip_avatars = skip_avatars

        # Ensure directories exist
        for directory in [
            self.talks_dir,
            self.speakers_dir,
            self.json_dir,
            self.images_dir,
            self.avatar_cache_dir,
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

    def copy_extra_content(self) -> None:
        """Copy extra YAML content files from extra_content/talks to talks directory."""
        extra_content_dir = Path(__file__).parent / "extra_content" / "talks"

        if not extra_content_dir.exists():
            click.echo(
                f"Extra content directory not found: {extra_content_dir}", err=True
            )
            return

        click.echo("Copying extra content files...", err=True)

        for yaml_file in extra_content_dir.glob("*.yaml"):
            target_file = self.talks_dir / yaml_file.name
            shutil.copy2(yaml_file, target_file)
            click.echo(f"  Copied: {yaml_file.name}", err=True)

    def process_talks(
        self,
        talks: List[Dict],
        qa_by_talk_code: Dict[str, str],
        schedule_lookup: Dict[str, Dict],
    ) -> Dict[str, Dict]:
        """Process talk data and save to files."""
        self.clean_directory(self.talks_dir)
        self.copy_extra_content()
        click.echo("Writing talk files...", err=True)

        talks_by_code = {}
        talk_data = []

        # redirects = []

        for talk in talks:
            # Process talk data
            processed_talk = self._process_single_talk(
                talk, qa_by_talk_code, schedule_lookup
            )

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

        # click.echo("Redirects:", err=True)
        # for redirect in redirects:
        #     click.echo(redirect, err=True)

        return talks_by_code

    def _process_single_talk(
        self,
        talk: Dict,
        qa_by_talk_code: Dict[str, str],
        schedule_lookup: Dict[str, Dict],
    ) -> Dict:
        """Process a single talk entry."""

        speakers = [
            {
                "name": s["name"],
                "avatar": s["avatar_url"],
                "code": s["code"],
                "slug": slugify(s["name"]),
            }
            for s in talk["speakers"]
        ]

        # Get basic talk data
        # Check if talk is canceled to preserve original slug (case-insensitive)
        is_canceled = talk["title"].lower().startswith("canceled:")

        if is_canceled:
            # For canceled talks, generate slug from title without "canceled:" prefix
            # Use regex to remove the prefix case-insensitively
            title_without_prefix = re.sub(
                r"^canceled:\s*", "", talk["title"], flags=re.IGNORECASE
            ).strip()
            slug = slugify(
                re.split(r"\?|\.|:", title_without_prefix)[0],
                word_boundary=True,
                max_length=64,
            )
        else:
            # Normal slug generation
            slug = slugify(
                re.split(r"\?|\.|:", talk["title"])[0],
                word_boundary=True,
                max_length=64,
            )

        processed_talk = {
            "code": talk["code"],
            "title": talk["title"],
            "slug": slug,
            # "old_slug": slugify(
            #     re.split(r"\?|\.", talk["title"])[0],
            #     word_boundary=True,
            #     max_length=64,
            # ),
            "description": markdown.markdown(
                talk["description"],
                extensions=[GithubFlavoredMarkdownExtension(), "footnotes"],
            ),
            "start_time": schedule_lookup.get(talk["code"], {}).get(
                "start_time", DEFAULT_TIME
            ),
            "end_time": schedule_lookup.get(talk["code"], {}).get(
                "end_time", DEFAULT_TIME
            ),
            "room": schedule_lookup.get(talk["code"], {}).get("room", "TBD"),
            "duration": talk["duration"],
            "speakers": speakers,
            "type": talk["submission_type"]["name"]["en"],
        }

        # Special handling for keynote slugs
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
        Uses a cache directory with original filenames to detect avatar changes.
        Returns the relative path to the saved image.
        """
        if not avatar_url or avatar_url == PLACEHOLDER_AVATAR:
            return DEFAULT_AVATAR_PATH

        if self.skip_avatars:
            # Check if avatar already exists in final location
            for ext in [".png", ".jpg", ".jpeg", ".gif", ".webp"]:
                image_path = self.images_dir / f"{speaker_slug}{ext}"
                if image_path.exists():
                    return f"{speaker_slug}{ext}"
            # If no existing avatar found, return default
            return DEFAULT_AVATAR_PATH

        # Add size parameter for Gravatar URLs
        if avatar_url.startswith("https://www.gravatar.com/avatar"):
            avatar_url = f"{avatar_url}?s=300"

        try:
            # Parse URL to get original filename for caching
            parsed_url = urlparse(avatar_url)
            original_path = parsed_url.path
            original_filename = os.path.basename(original_path)

            # Get file extension from URL or default to .png
            extension = os.path.splitext(original_path)[1].lower()
            if not extension or extension not in [
                ".jpg",
                ".jpeg",
                ".png",
                ".gif",
                ".webp",
            ]:
                extension = ".png"

            # If no original filename, create one from URL hash
            if not original_filename or original_filename == "/":
                # Use a hash of the URL for cache filename
                import hashlib

                url_hash = hashlib.md5(avatar_url.encode()).hexdigest()[:12]
                original_filename = f"{url_hash}{extension}"
            elif not original_filename.endswith(extension):
                original_filename += extension

            # Cache using original filename, final using speaker slug
            cache_filename = original_filename
            final_filename = f"{speaker_slug}{extension}"

            cache_path = self.avatar_cache_dir / cache_filename
            final_path = self.images_dir / final_filename
            relative_path = final_filename

            # Check if avatar exists in cache using original filename
            if cache_path.exists():
                click.echo(f"Using cached avatar for {speaker_slug}", err=True)
                # Copy from cache to final location with speaker slug name
                shutil.copy(cache_path, final_path)
                return relative_path

            # Download the image to cache with original filename
            response = httpx.get(avatar_url, follow_redirects=True, timeout=10.0)
            response.raise_for_status()

            # Save to cache with original filename
            with open(cache_path, "wb") as img_file:
                img_file.write(response.content)

            # Copy to final location with speaker slug filename
            shutil.copy(cache_path, final_path)

            click.echo(f"Downloaded and cached avatar for {speaker_slug}", err=True)
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
        avatar_url = speaker["avatar_url"] or PLACEHOLDER_AVATAR

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

    def process_breaks(self, break_sessions: List[Dict] = None) -> None:
        """Process break data and save to files."""
        click.echo("Writing break files...", err=True)

        # Process breaks from schedule API if provided
        if break_sessions:
            for break_session in break_sessions:
                save_filename = self.talks_dir / f"{break_session['slug']}.yaml"
                with open(save_filename, "w") as save_file:
                    yaml.dump(break_session, save_file, allow_unicode=True)

        # Also process any manually defined breaks from BREAKS constant
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
@click.option(
    "-v",
    "--verbose",
    is_flag=True,
    help="Enable verbose debug output",
)
@click.pass_context
def get_event_data(ctx, skip_avatars, verbose):
    """Get session and speaker data from Pretalx"""
    api_key = ctx.obj["api_key"]

    # Initialize client and processor
    client = PretalxClient(api_key, PRETALX_EVENT_ID, verbose=verbose)
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
    schedule_lookup, break_sessions = client.get_schedule_data()
    talks_by_code = processor.process_talks(talks, qa_by_talk_code, schedule_lookup)

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
    processor.process_breaks(break_sessions)


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
