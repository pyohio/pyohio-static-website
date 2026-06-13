"""Build a schedule grid structure from PreTalx slots.

The grid is grouped by day, then by start time. Each row is one of:

- ``talks``   one cell per room, aligned to the day's room order (``None`` for
              an empty room at that time)
- ``plenary`` a single full-width item (keynote, opening/closing remarks,
              lightning talks); carries an optional talk ``slug``/``speakers``
- ``break``   a full-width muted item (Break, Lunch)

PreTalx records breaks per-room, so the same break can appear in one to four
rooms at a given start time; grouping by start time collapses those into a
single row.
"""

from __future__ import annotations

from datetime import datetime

# Description-slot titles containing one of these words render as a muted
# break row spanning all rooms; anything else (Opening Remarks, Lightning
# Talks, Closing Remarks, ...) renders as a full-width plenary row.
BREAK_WORDS = ("break", "lunch")


def _room_name(slot: dict) -> str | None:
    room = slot.get("room") or {}
    name = room.get("name")
    if isinstance(name, dict):
        return name.get("en")
    return name


def _desc_text(slot: dict) -> str:
    desc = slot.get("description")
    if isinstance(desc, dict):
        return desc.get("en") or "Break"
    return desc or "Break"


def _fmt_time(iso: str) -> str:
    return datetime.fromisoformat(iso).strftime("%-I:%M %p")


def _day_label(date: str) -> str:
    return datetime.fromisoformat(date).strftime("%A, %B %-d")


def _speaker_names(record: dict | None) -> str:
    if not record:
        return ""
    return ", ".join(s["name"] for s in record.get("speakers", []))


def _ordered_rooms(slots: list[dict]) -> list[str]:
    positions: dict[str, int] = {}
    for slot in slots:
        name = _room_name(slot)
        if not name:
            continue
        room = slot.get("room") or {}
        positions[name] = room.get("position", 0)
    return sorted(positions, key=lambda n: positions[n])


def _build_row(
    start: str,
    group: list[dict],
    ordered_rooms: list[str],
    talks_by_code: dict[str, dict],
) -> dict:
    time = _fmt_time(start)
    talk_slots = [s for s in group if s.get("submission")]

    if talk_slots:
        keynotes = [
            t
            for t in talk_slots
            if (talks_by_code.get(t["submission"]) or {}).get("type") == "Keynote"
        ]
        if len(talk_slots) == 1 and keynotes:
            record = talks_by_code.get(talk_slots[0]["submission"]) or {}
            return {
                "time": time,
                "kind": "plenary",
                "title": record.get("title", "Keynote"),
                "slug": record.get("slug"),
                "speakers": _speaker_names(record),
            }

        by_room: dict[str, dict] = {}
        for slot in talk_slots:
            record = talks_by_code.get(slot["submission"])
            name = _room_name(slot)
            if record and name:
                by_room[name] = {
                    "title": record["title"],
                    "slug": record["slug"],
                    "speakers": _speaker_names(record),
                }
        cells = [by_room.get(room) for room in ordered_rooms]
        return {"time": time, "kind": "talks", "cells": cells}

    title = _desc_text(group[0])
    kind = "break" if any(w in title.lower() for w in BREAK_WORDS) else "plenary"
    return {"time": time, "kind": kind, "title": title}


def build_schedule(
    slots: list[dict],
    talks_by_code: dict[str, dict],
) -> list[dict]:
    """Return a list of days, each with ordered rooms and time-grouped rows."""
    ordered_rooms = _ordered_rooms(slots)

    by_day: dict[str, dict[str, list[dict]]] = {}
    for slot in slots:
        start = slot.get("start")
        if not start:
            continue
        by_day.setdefault(start[:10], {}).setdefault(start, []).append(slot)

    days = []
    for date in sorted(by_day):
        starts = by_day[date]
        rows = [
            _build_row(start, starts[start], ordered_rooms, talks_by_code)
            for start in sorted(starts)
        ]
        days.append(
            {
                "day": _day_label(date),
                "date": date,
                "rooms": list(ordered_rooms),
                "rows": rows,
            }
        )
    return days
