# Structured data follow-ups

The site emits JSON-LD for `Event`, `Organization` (home page only), and `BreadcrumbList` (every page with breadcrumbs). All emission lives in `2026/_themes/pyohio/components/jsonld.html`. These are the items to revisit as the conference firms up.

## Add specific times to Event dates

`startDate` and `endDate` in `2026/_themes/pyohio/components/jsonld.html` are date-only:

```jinja
"startDate": "2026-07-25",
"endDate":   "2026-07-26",
```

Once the schedule is finalized, replace with timestamped values in EDT (Cleveland is UTC-4 in July):

```jinja
"startDate": "2026-07-25T09:00:00-04:00",
"endDate":   "2026-07-26T17:00:00-04:00",
```

## When the speaker lineup exists

Add per-speaker `Profile page` markup (`Person` type) on each speaker page or as part of a speakers index. Recommended fields: `name`, `image`, `url`, `description`, `sameAs` for their social profiles. This is in Google's rich-results list and produces a Profile card.

Likely shape: a new branch in `jsonld.html` keyed off `schema_types: [Speaker]` (or similar) on a per-speaker page, sourcing data from frontmatter.

Also worth populating once the lineup is known: the Event's `performer` array (currently missing — Google flags this as a "recommended" warning). Each entry should be a `Person` reference.

## When talk recordings are published

Add `VideoObject` markup to each recording page. Required fields: `name`, `description`, `thumbnailUrl`, `uploadDate`, `contentUrl` or `embedUrl`. This is in Google's rich-results list and produces a video card.

For the talks themselves (whether or not recordings exist), consider whether they should be `subEvent` of the main Event in `jsonld.html` — adds richer Event context for Google.

## Registration URL in Offer

The Event's `offers.url` points at `/2026/attend/registration/`. If registration moves to a third-party platform (Eventbrite, ti.to, etc.), update `jsonld.html` so search engines link to the actual signup URL.
