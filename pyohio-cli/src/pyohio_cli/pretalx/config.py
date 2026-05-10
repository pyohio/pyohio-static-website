"""TOML config loader for pretalx commands."""

from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from pathlib import Path


@dataclass
class PretalxConfig:
    event_id: str
    year: str
    keynote_speaker_codes: list[str] = field(default_factory=list)
    unlisted_speaker_codes: list[str] = field(default_factory=list)


def load_config(path: Path) -> PretalxConfig:
    data = tomllib.loads(path.read_text())
    return PretalxConfig(
        event_id=data["event_id"],
        year=str(data["year"]),
        keynote_speaker_codes=list(data.get("keynote_speaker_codes", [])),
        unlisted_speaker_codes=list(data.get("unlisted_speaker_codes", [])),
    )
