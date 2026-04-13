#!/usr/bin/env python
"""
Fetch submission stats from the PreTalx API for all accessible PyOhio events.

Outputs a table showing submissions and unique submitters per day.

Usage:
    PRETALX_API_KEY=... python submission_stats.py
    PRETALX_API_KEY=... python submission_stats.py --events pyohio-2025
    PRETALX_API_KEY=... python submission_stats.py --output stats.csv
    PRETALX_API_KEY=... python submission_stats.py --output stats.xlsx
"""

import csv
import io
from collections import defaultdict
from datetime import date
from pathlib import Path

import click
import httpx

EVENT_SLUGS = [
    "pyohio-2026",
    "pyohio-2025",
    "pyohio-2024",
    "pyohio-2023",
    "pyohio-2022",
    "pyohio-2021",
    "pyohio-2020",
    "pyohio-2019",
]

COLUMNS = ["event", "date", "submissions", "submitters", "cumul_submissions", "cumul_submitters"]


def get_all_pages(url: str, headers: dict) -> list[dict]:
    results = []
    while url:
        r = httpx.get(url, headers=headers)
        if r.status_code == 403:
            return []
        if r.status_code == 404:
            return []
        r.raise_for_status()
        data = r.json()
        results.extend(data["results"])
        url = data.get("next")
    return results


def fetch_submissions(api_key: str, event_slug: str) -> list[dict]:
    headers = {"Authorization": f"Token {api_key}"}
    url = f"https://pretalx.com/api/events/{event_slug}/submissions/?limit=100"
    return get_all_pages(url, headers)


def build_daily_stats(submissions: list[dict]) -> dict[date, dict]:
    """Returns {date: {"submissions": int, "submitters": set(speaker_codes)}}"""
    by_day: dict[date, dict] = defaultdict(lambda: {"submissions": 0, "submitters": set()})
    for sub in submissions:
        created = sub.get("created", "")
        if not created:
            continue
        day = date.fromisoformat(created[:10])
        by_day[day]["submissions"] += 1
        for speaker in sub.get("speakers", []):
            by_day[day]["submitters"].add(speaker)
    return by_day


def compute_rows(event_slug: str, submissions: list[dict]) -> list[dict]:
    by_day = build_daily_stats(submissions)
    if not by_day:
        return []

    rows = []
    cumul_subs = 0
    cumul_submitters: set[str] = set()
    for day in sorted(by_day.keys()):
        stats = by_day[day]
        cumul_subs += stats["submissions"]
        cumul_submitters.update(stats["submitters"])
        rows.append({
            "event": event_slug,
            "date": day.isoformat(),
            "submissions": stats["submissions"],
            "submitters": len(stats["submitters"]),
            "cumul_submissions": cumul_subs,
            "cumul_submitters": len(cumul_submitters),
        })
    return rows


def print_event_table(event_slug: str, rows: list[dict]):
    if not rows:
        click.echo(f"  No submission data.\n")
        return

    total_subs = rows[-1]["cumul_submissions"]
    total_submitters = rows[-1]["cumul_submitters"]

    click.echo(f"  Total: {total_subs} submissions, {total_submitters} unique submitters\n")
    click.echo(f"  {'Date':<12} {'Submissions':>12} {'Submitters':>12}  {'Cumul. Subs':>12}  {'Cumul. Submitters':>18}")
    click.echo(f"  {'-'*12} {'-'*12} {'-'*12}  {'-'*12}  {'-'*18}")

    for row in rows:
        click.echo(
            f"  {row['date']:<12} {row['submissions']:>12} {row['submitters']:>12}"
            f"  {row['cumul_submissions']:>12}  {row['cumul_submitters']:>18}"
        )
    click.echo()


def write_csv(all_rows: list[dict], path: str):
    with open(path, "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS)
        writer.writeheader()
        writer.writerows(all_rows)


def write_xlsx(all_rows: list[dict], path: str):
    try:
        import openpyxl
    except ImportError:
        click.echo("openpyxl is required for xlsx output: pip install openpyxl", err=True)
        raise SystemExit(1)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Submission Stats"
    ws.append(COLUMNS)
    for row in all_rows:
        ws.append([row[c] for c in COLUMNS])

    # auto-size columns
    for col in ws.columns:
        max_len = max(len(str(cell.value or "")) for cell in col)
        ws.column_dimensions[col[0].column_letter].width = max_len + 2

    wb.save(path)


@click.command()
@click.option(
    "--events",
    default=None,
    help="Comma-separated event slugs to query (default: auto-discover from built-in list)",
)
@click.option(
    "--api-key",
    envvar="PRETALX_API_KEY",
    required=True,
    help="PreTalx API key (or set PRETALX_API_KEY env var)",
)
@click.option(
    "--output", "-o",
    default=None,
    help="Output file path (.csv or .xlsx). If omitted, prints table to stdout.",
)
def main(events: str | None, api_key: str, output: str | None):
    """Show submission counts and unique submitters by day for PyOhio PreTalx events."""
    slugs = [s.strip() for s in events.split(",")] if events else EVENT_SLUGS

    all_rows: list[dict] = []
    for slug in slugs:
        click.echo(f"=== {slug} ===", err=True)
        submissions = fetch_submissions(api_key, slug)
        if not submissions:
            click.echo(f"  No access or no submissions.\n")
            continue
        rows = compute_rows(slug, submissions)
        all_rows.extend(rows)

        if output is None:
            click.echo(f"\n{slug}")
            print_event_table(slug, rows)

    if output:
        ext = Path(output).suffix.lower()
        if ext == ".xlsx":
            write_xlsx(all_rows, output)
        else:
            write_csv(all_rows, output)
        click.echo(f"Wrote {len(all_rows)} rows to {output}", err=True)


if __name__ == "__main__":
    main()
