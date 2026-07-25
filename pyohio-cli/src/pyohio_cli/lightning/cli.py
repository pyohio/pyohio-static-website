"""Lightning-talk processing CLI.

Reads a plain-text list of accepted lightning talks in the format

    Title - Speaker Name (email@example.com)

one per line, Wikipedia-title-cases the titles, randomizes the order, and writes
them into the lightning-talks page frontmatter. The speaker email addresses are
printed for follow-up.
"""

from __future__ import annotations

import random
import re
from pathlib import Path

import click

from pyohio_cli._frontmatter import update_frontmatter_key
from pyohio_cli.lightning.titlecase import titlecase

DEFAULT_INPUT = Path("lightning-talks.txt")
DEFAULT_PAGE = Path("2026/content/program/lightning-talks.md")

# "<title> - <speaker> (<email>)" — the email in trailing parens is the anchor;
# the title/speaker split is on the last " - " so titles may contain hyphens.
_EMAIL_RE = re.compile(r"^(?P<body>.*?)\((?P<email>[^()]+)\)\s*$")


def parse_line(line: str) -> tuple[str, str, str] | None:
    """Parse one line into (title, speaker, email), or None for blank lines."""
    line = line.strip()
    if not line:
        return None
    match = _EMAIL_RE.match(line)
    if not match:
        raise click.UsageError(f"No (email) found in line: {line!r}")
    email = match.group("email").strip()
    body = match.group("body").strip()
    if " - " not in body:
        raise click.UsageError(f"No ' - ' between title and speaker in line: {line!r}")
    title, speaker = body.rsplit(" - ", 1)
    return title.strip(), speaker.strip(), email


@click.group()
def lightning():
    """Process the accepted lightning-talks list."""


@lightning.command("populate")
@click.argument(
    "input_file",
    default=DEFAULT_INPUT,
    type=click.Path(exists=True, dir_okay=False, path_type=Path),
)
@click.option(
    "--page",
    type=click.Path(dir_okay=False, path_type=Path),
    default=DEFAULT_PAGE,
    show_default=True,
    help="Lightning-talks markdown page to populate.",
)
@click.option(
    "--seed",
    type=int,
    default=None,
    help="Seed the shuffle for a reproducible order (default: random).",
)
def populate_cmd(input_file: Path, page: Path, seed: int | None):
    """Title-case, randomize, and write the lightning talks into the page."""
    entries = [
        parsed
        for line in input_file.read_text().splitlines()
        if (parsed := parse_line(line)) is not None
    ]
    if not entries:
        raise click.UsageError(f"No talks found in {input_file}")

    talks = [{"title": titlecase(title), "speaker": speaker} for title, speaker, _ in entries]
    emails = [email for *_, email in entries]

    random.Random(seed).shuffle(talks)
    update_frontmatter_key(page, "lightning_talks", talks)

    click.echo(f"Wrote {len(talks)} lightning talks (random order) to {page}", err=True)

    # Email addresses to stdout so they can be captured/piped.
    click.echo("\nEmail addresses:")
    for email in emails:
        click.echo(email)
    click.echo("\n" + ", ".join(emails))
