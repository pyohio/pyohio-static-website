"""Playwright wrapper for screenshotting title-slide HTML to PNG."""

from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

SLIDE_WIDTH = 1920
SLIDE_HEIGHT = 1080


class SlideRenderer:
    """Reusable Playwright browser+page for rendering many title slides.

    Usage:
        with SlideRenderer() as r:
            r.render(html_path, out_path)
            ...
    """

    def __init__(self) -> None:
        self._pw = None
        self._browser = None
        self._page = None

    def __enter__(self) -> SlideRenderer:
        self._pw = sync_playwright().start()
        self._browser = self._pw.chromium.launch()
        self._page = self._browser.new_page(
            viewport={"width": SLIDE_WIDTH, "height": SLIDE_HEIGHT},
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
        """Load an HTML file and screenshot the .slide-frame element to output_path."""
        if self._page is None:
            raise RuntimeError("SlideRenderer must be used as a context manager")
        self._page.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        frame = self._page.locator(".slide-frame")
        output_path.parent.mkdir(parents=True, exist_ok=True)
        frame.screenshot(path=str(output_path))
