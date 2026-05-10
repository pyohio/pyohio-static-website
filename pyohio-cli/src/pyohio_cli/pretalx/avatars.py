"""Speaker avatar download + cache."""

from __future__ import annotations

import hashlib
import os
import shutil
from pathlib import Path
from urllib.parse import urlparse

import click
import httpx

VALID_EXTENSIONS = (".jpg", ".jpeg", ".png", ".gif", ".webp")
PLACEHOLDER_AVATAR_URL = "https://www.pyohio.org/no-profile.png"


class AvatarDownloader:
    """Downloads and caches speaker avatars.

    cache_dir holds the original-filename downloads (committed; reused across runs).
    output_dir holds the per-speaker, slug-named copy used by the site.
    """

    def __init__(
        self,
        cache_dir: Path,
        output_dir: Path,
        public_path_prefix: str,
        *,
        skip: bool = False,
    ):
        self.cache_dir = cache_dir
        self.output_dir = output_dir
        self.public_path_prefix = public_path_prefix.rstrip("/")
        self.skip = skip
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def fetch(self, avatar_url: str | None, speaker_slug: str) -> str | None:
        """Return a public URL for the speaker's avatar, or None if unavailable."""
        if not avatar_url or avatar_url == PLACEHOLDER_AVATAR_URL:
            return None

        if self.skip:
            for ext in VALID_EXTENSIONS:
                if (self.output_dir / f"{speaker_slug}{ext}").exists():
                    return f"{self.public_path_prefix}/{speaker_slug}{ext}"
            return None

        if avatar_url.startswith("https://www.gravatar.com/avatar"):
            avatar_url = f"{avatar_url}?s=300"

        parsed = urlparse(avatar_url)
        original_filename = os.path.basename(parsed.path)
        extension = os.path.splitext(parsed.path)[1].lower()
        if extension not in VALID_EXTENSIONS:
            extension = ".png"
        if not original_filename or original_filename == "/":
            url_hash = hashlib.md5(avatar_url.encode()).hexdigest()[:12]
            original_filename = f"{url_hash}{extension}"
        elif not original_filename.endswith(extension):
            original_filename += extension

        cache_path = self.cache_dir / original_filename
        final_filename = f"{speaker_slug}{extension}"
        final_path = self.output_dir / final_filename

        if cache_path.exists():
            click.echo(f"Using cached avatar for {speaker_slug}", err=True)
            shutil.copy(cache_path, final_path)
            return f"{self.public_path_prefix}/{final_filename}"

        try:
            response = httpx.get(avatar_url, follow_redirects=True, timeout=15.0)
            response.raise_for_status()
        except httpx.HTTPError as e:
            click.echo(f"Avatar download failed for {speaker_slug}: {e}", err=True)
            return None

        cache_path.write_bytes(response.content)
        shutil.copy(cache_path, final_path)
        click.echo(f"Downloaded avatar for {speaker_slug}", err=True)
        return f"{self.public_path_prefix}/{final_filename}"
