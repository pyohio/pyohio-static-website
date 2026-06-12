---
title: 'Python on CubeSatSim: Real Spacecraft Telemetry with a Raspberry Pi'
page_type: talk
code: 9T8F9K
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Python on CubeSatSim
speakers:
  - name: Cliff Jenkins
    slug: cliff-jenkins
    code: CYDAQ9
    avatar: /2026/img/speakers/cliff-jenkins.webp
og_image: https://www.pyohio.org/2026/img/og/talks/python-on-cubesatsim.png
---

About 60% of CubeSats launched by first-time teams fail within their first mission. The CubeSatSim project exists to fix that — and it runs Python.
CubeSatSim is an open-source, pocket-sized satellite simulator built on a Raspberry Pi Zero 2, used by AMSAT and universities worldwide to teach the full spacecraft software stack before anything goes into orbit. In this talk, we'll explore the Python code that makes it work: reading battery current and solar panel voltage over I²C with smbus2, formatting and transmitting APRS and BPSK telemetry over UHF radio, switching between transmission modes via subprocess, and receiving and decoding live telemetry in FoxTelem.
Whether you've never touched hardware before or you're already writing embedded Python, you'll walk away with a working mental model of how Python bridges the gap between physical sensors and radio communication — and a new appreciation for how much real spacecraft software looks like Python you've already written.
