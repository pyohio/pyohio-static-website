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
start: '2026-07-25T10:15:00-04:00'
end: '2026-07-25T10:45:00-04:00'
room: Ballroom D
slot_label: Saturday at 10:15 AM
og_image: https://www.pyohio.org/2026/img/og/talks/what-if-voyager-launched-in-2026-and-ran-python.png
---

NASA’s Voyager computers were launched with 69 kilobytes of total memory. Python's "Hello World" needs 30 megabytes just to start. Can we fix that?

This is a thought experiment about extreme constraints and what they reveal about Python itself. Voyager 1 has been running since 1977 on custom hardware programmed in Fortran and Assembly, transmitting data from interstellar space at 160 bits per second with a 22-hour one-way communication delay. If we designed a Voyager-class deep-space probe today, what would Python need to become a viable onboard language?

We'll work through five constraints:

- resource scarcity 
- real-time determinism
- radiation-induced bit flips
- a 50-year no-repair operational lifetime
- complete communication isolation

For each one, we will find that Python already has the seeds of an answer.

You will leave with a new paradigm about Python's garbage collector, its memory model, and the architectural pattern where Python is the supervisor and C is the actuator. 

No hardware knowledge is required, just curiosity about what happens when you push a language to its absolute limit.
