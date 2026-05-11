---
title: 'Testing the Parts You Don’t See: Pseudo-Tested Native Code in Python Libraries'
page_type: talk
code: ECMFJE
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Testing the Parts You Don’t See
speakers:
  - name: Issei Hasegawa
    slug: issei-hasegawa
    code: VZ3BCT
    avatar: /2026/img/speakers/issei-hasegawa.webp
  - name: Gregory M. Kapfhammer
    slug: gregory-m-kapfhammer
    code: RVA9JL
    avatar: /2026/img/speakers/gregory-m-kapfhammer.webp
og_image: https://www.pyohio.org/2026/img/og/talks/testing-the-parts-you-dont-see.png
---

Python test suites can look strong while still missing important problems. A package may have high coverage, passing tests, and a clean public API, yet some of its most important behavior may not be checked in a way that would catch real mistakes. This is especially important for Python libraries that rely on native extensions written in C, C++, or Rust, such as NumPy, scikit-learn, and Polars. In these projects, Python-level tests may exercise the public API while still missing mistakes in the performance-critical native implementation underneath.

In this talk, we will show how **mutation testing** can make that gap visible. Mutation testing works by making small, meaningful changes to code and checking whether the test suite catches them; when a change survives, it suggests that “covered” does not always mean “well tested.” Using concrete examples, we will explain how this idea applies to Python packages with native internals and discuss practical challenges such as choosing mutation targets, rebuilding native extensions, and interpreting surviving mutations. Attendees will leave with a clearer understanding of the limits of coverage in extension-backed Python libraries, along with practical ideas for improving tests around native-backed APIs.
