#!/usr/bin/env python
import os
from datetime import datetime
from pathlib import Path

import click
import httpx
import markdown
import yaml

from mdx_gfm import GithubFlavoredMarkdownExtension
from slugify import slugify

try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

PRETALX_EVENT_ID = "pyohio-2021"
DATA_DIR = Path("./data")
PLACEHOLDER_AVATAR = "https://www.pyohio.org/no-profile-2021.png"


@click.group()
@click.pass_context
def pretalx(ctx):
    """Utilities for getting data from Pretalx"""

    ctx.obj = {}
    try:
        ctx.obj["api_key"] = os.environ["PRETALX_API_KEY"]
    except KeyError:
        click.echo(
            "Environment variable must be set to interact with Pretalx: PRETALX_API_KEY"
        )
        raise click.Abort()

    if not Path(".projectroot").is_file():
        click.echo(
            "File not found: .projectroot\nMake sure this command is run from the project root and not ./scripts!"
        )
        raise click.Abort()


@pretalx.command()
@click.pass_context
def get_event_data(ctx):
    """Get session and speaker data from Pretalx"""
    headers = {"Authorization": f"Token {ctx.obj['api_key']}"}

    click.echo("Getting questions...", err=True)
    questions_url = (
        f"https://pretalx.com/api/events/{PRETALX_EVENT_ID}/questions"
    )
    questions_results = get_all_json_results(questions_url, headers)
    twitter_question_id = None
    for question in questions_results:
        if question["question"]["en"] == "Twitter" and question["target"] == "speaker":
            twitter_question_id = question["id"]
   
    click.echo("Getting answers...", err=True)
    twitter_by_speaker_code = {}
    if twitter_question_id:
        answers_url = f"https://pretalx.com/api/events/{PRETALX_EVENT_ID}/answers?question={twitter_question_id}"
        
        answers_results = get_all_json_results(answers_url, headers)
        for answer in answers_results:
            twitter_by_speaker_code[answer["person"]] = answer["answer"].lstrip('@')

    click.echo("Getting talks...", err=True)
    sessions_url = (
        f"https://pretalx.com/api/events/{PRETALX_EVENT_ID}/submissions?state=confirmed"
    )
    sessions_results = get_all_json_results(sessions_url, headers)

    click.echo("Deleteing old talk files...", err=True)
    for f in Path(f"{DATA_DIR}/talks").glob('*.yaml'):
        try:
            f.unlink(missing_ok=True)
        except OSError as e:
            click.echo("Error: %s : %s" % (f, e.strerror), err=True)

    click.echo("Writing talk files...", err=True)
    talks_by_code = {}
    for talk in sessions_results:
        speakers = [
            {
                "name": s["name"],
                "avatar": s["avatar"],
                "code": s["code"],
                "slug": slugify(s["name"]),
            }
            for s in talk["speakers"]
        ]
        data = {
            "code": talk["code"],
            "title": talk["title"],
            "slug": slugify(talk["title"]),
            "description": markdown.markdown(talk["description"], extensions=[GithubFlavoredMarkdownExtension(), 'footnotes']),
            "start_time": talk.get("slot", {}).get("start"),
            "end_time": talk.get("slot", {}).get("end"),
            "duration": talk["duration"],
            "speakers": speakers,
            "type": talk["submission_type"]["en"],
        }
        talks_by_code[talk["code"]] = data
        save_filename = Path(f"{DATA_DIR}/talks/").joinpath(f"{data['slug']}.yaml")
        with open(save_filename, "w") as save_file:
            yaml.dump(data, save_file, allow_unicode=True)

    click.echo("Getting speaker info...", err=True)
    speaker_codes = []
    for talk in sessions_results:
        for speaker in talk["speakers"]:
            speaker_codes.append(speaker["code"])
    speaker_data = []
    for speaker_code in speaker_codes:
        speaker_url = (
            f"https://pretalx.com/api/events/{PRETALX_EVENT_ID}/speakers/{speaker_code}"
        )
        response = httpx.get(speaker_url, headers=headers)
        response.raise_for_status()
        speaker_data.append(response.json())

    click.echo("Deleteing old speaker files...", err=True)
    for f in Path(f"{DATA_DIR}/speakers").glob('*.yaml'):
        try:
            f.unlink(missing_ok=True)
        except OSError as e:
            click.echo("Error: %s : %s" % (f, e.strerror), err=True)

    click.echo("Writing speaker files...", err=True)
    for speaker in speaker_data:
        if speaker["biography"] is None:
            speaker["biography"] = ""
        data = {
            "name": speaker["name"],
            "slug": slugify(speaker["name"]),
            "code": speaker["code"],
            "avatar": speaker["avatar"],
            "listed": True,
            "biography": markdown.markdown(speaker["biography"], extensions=[GithubFlavoredMarkdownExtension(), 'footnotes']),
        }
        if data["avatar"] is None:
            data["avatar"] = PLACEHOLDER_AVATAR
        if data["avatar"].startswith("https://www.gravatar.com/avatar"):
            data["avatar"] = f"{data['avatar']}?s=300"
        talk_codes = [s for s in speaker["submissions"] if s in talks_by_code]
        speaker_talks = []
        for talk_code in talk_codes:
            talk = {
                "code": talk_code,
                "slug": talks_by_code[talk_code]["slug"],
                "title": talks_by_code[talk_code]["title"],
            }
            speaker_talks.append(talk)
        data["talks"] = speaker_talks
        data["twitter"] = twitter_by_speaker_code.get(data["code"])

        # make organizers unlisted
        if data["code"] == "KGVCNV":
            data["listed"] = False

        save_filename = Path(f"{DATA_DIR}/speakers/").joinpath(f"{data['slug']}.yaml")
        with open(save_filename, "w") as save_file:
            yaml.dump(data, save_file, allow_unicode=True)


def get_all_json_results(url, headers):
    results = []
    response = httpx.get(url, headers=headers)
    response.raise_for_status()
    response_json = response.json()
    results.extend(response_json["results"])
    if url := response_json["next"]:
        sub_results = get_all_json_results(url, headers=headers)
        results.extend(sub_results)
    return results


def write_yaml_document(document, filename, path="."):
    outfile_name = str(Path(path, filename).resolve())
    with open(outfile_name, "w") as outfile:
        yaml.dump(document, outfile, default_flow_style=False, Dumper=Dumper)


if __name__ == "__main__":
    pretalx()
