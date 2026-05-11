---
title: "Don't Blame the Type Checker: Finding Who Is Right When Python Type Checkers Disagree"
page_type: talk
code: YJAZUV
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Don't Blame the Type Checker
speakers:
  - name: Benedek Kaibas
    slug: benedek-kaibas
    code: 3ADSLS
    avatar: /2026/img/speakers/benedek-kaibas.webp
  - name: Gregory M. Kapfhammer
    slug: gregory-m-kapfhammer
    code: RVA9JL
    avatar: /2026/img/speakers/gregory-m-kapfhammer.webp
og_image: https://www.pyohio.org/2026/img/og/talks/don-t-blame-the-type-checker.png
---

Type checkers help Python developers catch bugs, but what happens when they disagree on the same code? One type checker says your code is fine, another flags an error. Which one is right? [Pytifex](https://github.com/benedekaibas/pytifex) is an open-source tool that solves this problem. It automatically generates code examples that lead to disagreements between type checkers by mining closed bug reports from type checker repositories, further mutating them with an LLM to generate novel edge cases, and running four checkers — mypy, pyrefly, zuban, and ty — on each example. Correctness is then evaluated through progressively harder phases, from runtime crash detection to hypothesis-based property testing. Pytifex has already uncovered confirmed defects across multiple type checkers, demonstrating that even mature tools have blind spots on code derived from bugs they have already fixed.

Attendees will leave understanding why type checker disagreements happen, why they matter for Python developers, how Pytifex mines and mutates real bug reports to generate novel test cases, and why framing type checker correctness in terms of false positives and false negatives misses the point. They will also see how the multi-phase evaluation pipeline distinguishes objective phases (where a clear ground truth exists) from subjective ones that rely on interpretation, and why that distinction matters for trusting the results. We will walk through real examples where the outlying checker turned out to be right and the majority was wrong and leave knowing how to set up and run Pytifex themselves.
