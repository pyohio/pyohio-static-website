"""Run the speakers CSV export as a Rockgarden post_collect hook.

Invoked as ``python3 -m pyohio_cli.csv_export`` so it works in the Netlify
build (plain python3, no uv/click). Reads the paths Rockgarden exports:
``ROCKGARDEN_CONTENT_JSON`` and ``ROCKGARDEN_OUTPUT``.
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from pyohio_cli.csv_export.generator import generate

BASE_URL = "https://www.pyohio.org"


def main() -> None:
    content_json = os.environ.get("ROCKGARDEN_CONTENT_JSON")
    out_root = os.environ.get("ROCKGARDEN_OUTPUT")
    if not content_json or not out_root:
        sys.exit(
            "csv_export hook expects ROCKGARDEN_CONTENT_JSON and "
            "ROCKGARDEN_OUTPUT in the environment (set by Rockgarden)."
        )

    output = Path(out_root) / "program" / "speakers" / "speakers.csv"
    count = generate(
        content_json=Path(content_json), output=output, base_url=BASE_URL
    )
    print(f"Wrote {count} row(s) to {output}")


if __name__ == "__main__":
    main()
