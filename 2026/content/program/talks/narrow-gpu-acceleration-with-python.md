---
title: Narrow GPU Acceleration With Python​
page_type: talk
code: 73CWJ7
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Narrow GPU Acceleration With Python​
speakers:
  - name: Cole Sutyak
    slug: cole-sutyak
    code: 77LLQP
    avatar: /2026/img/speakers/cole-sutyak.webp
start: '2026-07-25T11:00:00-04:00'
end: '2026-07-25T11:30:00-04:00'
room: Ballroom B
slot_label: Saturday at 11:00 AM
og_image: https://www.pyohio.org/2026/img/og/talks/narrow-gpu-acceleration-with-python.png
---

This talk introduces a practical mental model for understanding GPU acceleration in Python, with a focus on real performance limits rather than abstract theory. Using a simple but representative example problem, we explore how modern hardware actually executes tensor computations and why performance is often constrained by memory rather than compute.

We walk through tensors, parallelism, and GPU architecture, then build toward a quantitative framework using FLOPs, memory bandwidth, and arithmetic intensity. The talk culminates in applying the roofline model to analyze performance, followed by practical optimization techniques such as kernel fusion and tiling, with a real implementation example.

The goal is to move beyond “make it faster” and toward understanding why something is fast or slow.
