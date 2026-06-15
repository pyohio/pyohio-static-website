"""PreTalx API client."""

from __future__ import annotations

import click
import httpx


class PretalxClient:
    """Paginated PreTalx API access."""

    def __init__(self, api_key: str, event_id: str, *, verbose: bool = False):
        self.api_key = api_key
        self.event_id = event_id
        self.verbose = verbose
        self.base_url = f"https://pretalx.com/api/events/{event_id}"
        self.headers = {
            "Authorization": f"Token {api_key}",
            "Pretalx-Version": "v1",
        }

    def _get_all_pages(self, url: str) -> list[dict]:
        results: list[dict] = []
        while url:
            response = httpx.get(url, headers=self.headers, timeout=30.0)
            try:
                response.raise_for_status()
            except httpx.HTTPStatusError:
                click.echo(
                    f"HTTP {response.status_code} from {url}: {response.text}",
                    err=True,
                )
                raise
            payload = response.json()
            results.extend(payload["results"])
            url = payload.get("next")
        return results

    def get_questions(self) -> tuple[str | None, str | None]:
        """Return (social_media_question_id, qa_question_id) or (None, None)."""
        click.echo("Getting questions...", err=True)
        results = self._get_all_pages(f"{self.base_url}/questions/")
        social_id: str | None = None
        qa_id: str | None = None
        for q in results:
            text = q["question"].get("en") if isinstance(q["question"], dict) else q["question"]
            if text == "Social Media" and q["target"] == "speaker":
                social_id = q["id"]
            elif text == "Q & A" and q["target"] == "submission":
                qa_id = q["id"]
        click.echo(f"Got {len(results)} questions", err=True)
        return social_id, qa_id

    def get_answers_by_question(self, question_id: str | None) -> dict[str, str]:
        if not question_id:
            return {}
        results = self._get_all_pages(
            f"{self.base_url}/answers/?question={question_id}"
        )
        out: dict[str, str] = {}
        for ans in results:
            key = ans.get("person") or ans.get("submission")
            if key:
                out[key] = ans["answer"]
        return out

    def get_confirmed_submissions(self) -> list[dict]:
        click.echo("Getting confirmed submissions...", err=True)
        results = self._get_all_pages(
            f"{self.base_url}/submissions/?state=confirmed&expand=speakers,submission_type"
        )
        click.echo(f"Got {len(results)} submissions", err=True)
        return results

    def get_slots(self) -> list[dict]:
        """Return all scheduled slots (talks and breaks) with rooms expanded."""
        click.echo("Getting schedule slots...", err=True)
        results = self._get_all_pages(f"{self.base_url}/slots/?expand=room")
        click.echo(f"Got {len(results)} slots", err=True)
        return results

    def get_speaker(self, code: str) -> dict:
        response = httpx.get(
            f"{self.base_url}/speakers/{code}/",
            headers=self.headers,
            timeout=30.0,
        )
        response.raise_for_status()
        return response.json()
