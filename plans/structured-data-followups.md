# Structured data follow-ups

The site has a JSON-LD foundation in place (`Event`, `Organization`, `Place`, plus empty `ItemList` placeholders for speakers/keynotes/talks). These are the items to revisit as the conference firms up.

## Add specific times to Event dates

`startDate` and `endDate` in `2026/_themes/pyohio/components/_event_data.html` are date-only:

```jinja
"startDate": "2026-07-25",
"endDate":   "2026-07-26",
```

Once the schedule is finalized, replace with timestamped values in EDT (Cleveland is UTC-4 in July):

```jinja
"startDate": "2026-07-25T09:00:00-04:00",
"endDate":   "2026-07-26T17:00:00-04:00",
```

## Populate speakers

`2026/content/program/speakers.md` and `program/keynote-speakers.md` both declare `schema_types: [SpeakerList]`. The emitter (`components/jsonld.html`) already iterates a `speakers` frontmatter array. To populate, add to frontmatter:

```yaml
speakers:
  - name: Jane Doe
  - name: John Smith
```

Each entry becomes a `Person` inside the `ItemList`. Extend the `Person` shape (e.g. `image`, `url`, `description`) by editing the `SpeakerList` branch in `components/jsonld.html` once the source data shape is known.

## Populate talks

`2026/content/program/talks.md` declares `schema_types: [TalkList]`. The emitter iterates a `talks` frontmatter array and emits each as a sub-`Event` inside an `ItemList`. The current placeholder shape:

```yaml
talks:
  - name: Talk title
```

When real talk data lands, decide on the richer shape (e.g. `description`, `performer`, `startDate`, `location`) and extend the `TalkList` branch in `components/jsonld.html` to match.

## Populate schedule

`2026/content/program/schedule.md` declares `schema_types: [Event]` and currently re-uses the canonical Event by `@id`. To list sessions, extend the `Event` branch in `components/jsonld.html` to read a `subEvent` array from the schedule page's frontmatter (or from the talks page) and merge it into the Event node only when present. Each `subEvent` should be a sub-`Event` with `name`, `startDate`, `endDate`, `location`, and `performer`.

## Reconsider home-page sponsor embed

Sponsor `Organization` JSON-LD currently only renders on `/sponsors/`. To surface sponsors in the home page Event's `sponsor[]` array, sponsor data needs to be reachable from the home template — either via cross-page frontmatter access (if Rockgarden supports it) or by moving the sponsor list into `_event_data.html` (or a new shared partial) so both pages read from the same source.

## Registration URL in Offer

The Event's `offers.url` points at `/2026/attend/registration/`. If registration moves to a third-party platform (Eventbrite, ti.to, etc.), update `_event_data.html` so search engines link to the actual signup URL.
