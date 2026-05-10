"""Playwright wrapper for screenshotting OG card HTML to PNG."""

from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

OG_WIDTH = 1200
OG_HEIGHT = 630


class OGRenderer:
    """Reusable Playwright browser+page for rendering many OG cards.

    Usage:
        with OGRenderer() as r:
            r.render(html_path, out_path)
            ...
    """

    def __init__(self) -> None:
        self._pw = None
        self._browser = None
        self._page = None

    def __enter__(self) -> OGRenderer:
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch()
        self._page = self._browser.new_page(
            viewport={"width": OG_WIDTH, "height": OG_HEIGHT},
            device_scale_factor=1,
        )
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        if self._page:
            self._page.close()
        if self._browser:
            self._browser.close()
        if self._pw:
            self._pw.stop()

    def render(self, html_path: Path, output_path: Path) -> None:
        """Load an HTML file and screenshot the .og-frame element to output_path."""
        if self._page is None:
            raise RuntimeError("OGRenderer must be used as a context manager")
        self._page.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        frame = self._page.locator(".og-frame")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        frame.screenshot(path=str(output_path))
