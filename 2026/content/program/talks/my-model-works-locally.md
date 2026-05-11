---
title: My Model Works Locally. Why Is Production Lying to Me?
page_type: talk
code: B9WZN9
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: My Model Works Locally
speakers:
  - name: Dinky Mishra
    slug: dinky-mishra
    code: PFKH88
    avatar: /2026/img/speakers/dinky-mishra.webp
og_image: https://www.pyohio.org/2026/img/og/talks/my-model-works-locally.png
---

You tested it. You validated it. It worked perfectly on your machine. Then you deployed it, and everything fell apart.
Production failures are not random. They follow patterns, and once you know them, you will start spotting them before they cost you a week of debugging. Through a structured walkthrough of real failure scenarios, this talk breaks down the five most common reasons ML models and Python applications behave differently in production than they did during experimentation: training-serving skew, environment mismatches, silent type errors, data assumptions that stop being true, and non-determinism from unseeded randomness.
Each failure mode is paired with a clear diagnosis and a concrete fix you can apply before your next deployment.
**Who this is for:** Anyone who has deployed a Python application or ML model and been surprised by what happened next. Also valuable for anyone preparing to deploy for the first time.
