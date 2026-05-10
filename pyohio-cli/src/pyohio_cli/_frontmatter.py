"""Shared YAML frontmatter helpers.

Both `pretalx` and `og` workflows rewrite specific keys in markdown
frontmatter while preserving the rest of the file. The implementation
lives here so it isn't duplicated across packages.
"""

from __future__ import annotations

import io
from pathlib import Path

import click
from ruamel.yaml import YAML


def yaml_loader() -> YAML:
    y = YAML()
    y.preserve_quotes = True
    y.indent(mapping=2, sequence=4, offset=2)
    y.width = 4096
    return y


def update_frontmatter_key(path: Path, key: str, value) -> None:
    """Rewrite a single frontmatter key on a markdown file, preserving the body."""
    text = path.read_text()
    if not text.startswith("---\n"):
        raise click.UsageError(f"{path} missing frontmatter")
    end = text.find("\n---\n", 4)
    if end == -1:
        raise click.UsageError(f"{path} has no closing frontmatter delimiter")

    body = text[end + len("\n---\n") :]
    yaml = yaml_loader()
    data = yaml.load(text[4:end]) or {}
    data[key] = value

    buf = io.StringIO()
    yaml.dump(data, buf)
    new_fm = buf.getvalue()
    if not new_fm.endswith("\n"):
        new_fm += "\n"
    path.write_text(f"---\n{new_fm}---\n{body}")


def read_frontmatter(path: Path) -> dict:
    """Return the parsed frontmatter dict for a markdown file."""
    text = path.read_text()
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    yaml = yaml_loader()
    return yaml.load(text[4:end]) or {}
