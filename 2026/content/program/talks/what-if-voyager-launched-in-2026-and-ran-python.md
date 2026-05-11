---
title: What If Voyager Launched in 2026 — and Ran Python?
page_type: talk
code: ZJREFR
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: What If Voyager Launched in 2026 — and Ran Python
speakers:
  - name: Cliff Jenkins
    slug: cliff-jenkins
    code: CYDAQ9
    avatar: /2026/img/speakers/cliff-jenkins.webp
og_image: https://www.pyohio.org/2026/img/og/talks/what-if-voyager-launched-in-2026-and-ran-python.png
---

Voyager's computers have 69 kilobytes of total memory. Python's "Hello World" needs 30 megabytes just to start. So — could we fix that?
This is a thought experiment about extreme constraints and what they reveal about Python itself. Voyager 1 has been running since 1977 on custom hardware programmed in Fortran and assembly, transmitting data from interstellar space at 160 bits per second with a 22-hour one-way communication delay. If we were designing a Voyager-class deep-space probe today, what would Python need to become to be a viable onboard language?
We'll work through five brutal constraints — radical resource scarcity, real-time determinism, radiation-induced bit flips, a 50-year no-repair operational lifetime, and complete communication isolation — and for each one, we'll find that Python already has the seeds of an answer
You'll leave with a new way to think about Python's garbage collector, its memory model, and its most durable architectural pattern: Python as supervisor, C as actuator. No hardware knowledge required — just curiosity about what happens when you push a language to its absolute limit.
