---
title: 'In Defense of Thoughtful Testing: Rethinking Quality in the Age of AI-Generated Code'
page_type: talk
code: P7NXWW
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: In Defense of Thoughtful Testing
speakers:
  - name: Rodrigo Silva Ferreira
    slug: rodrigo-silva-ferreira
    code: VTFXQW
    avatar: /2026/img/speakers/rodrigo-silva-ferreira.webp
og_image: https://www.pyohio.org/2026/img/og/talks/in-defense-of-thoughtful-testing.png
---

AI can now generate working code in seconds, often complete with tests. But something subtle is breaking: passing tests is no longer a strong signal of correctness.

For decades, software development has relied on a simple assumption: writing code is hard, but verifying it is relatively easy. In computational terms, we have treated correctness like a problem where solutions may be difficult to find, but easy to check.

Sudoku is the canonical example. Solving a difficult grid can take significant effort, but once a solution is produced, verifying it is trivial. Every row, column, and box either satisfies the constraints or it does not.

```
+-------+-------+-------+
| 5 3 4 | 6 7 8 | 9 1 2 |
| 6 7 2 | 1 9 5 | 3 4 8 |
| 1 9 8 | 3 4 2 | 5 6 7 |
+-------+-------+-------+
| 8 5 9 | 7 6 1 | 4 2 3 |
| 4 2 6 | 8 5 3 | 7 9 1 |
| 7 1 3 | 9 2 4 | 8 5 6 |
+-------+-------+-------+
| 9 6 1 | 5 3 7 | 2 8 4 |
| 2 8 7 | 4 1 9 | 6 3 5 |
| 3 4 5 | 2 8 6 | 1 7 9 |
+-------+-------+-------+
```

In Sudoku, correctness is explicit and checkable.

This talk argues that AI breaks that model. Generating code is becoming trivial, while *meaningfully verifying it is becoming the hardest part of software development*.

In Python workflows, this shift is already visible. It is now common to generate a function, generate a pytest suite for it, run CI, and get a green checkmark without ever meaningfully challenging the underlying assumptions. The result is not necessarily correctness. It is **self-consistency**.

We will look at how these closed-loop validation patterns emerge in practice:
- APIs that return the correct shape but the wrong meaning  
- data pipelines that produce valid outputs but incorrect conclusions  
- systems that pass every test and still fail in real usage  

These failures do not come from broken code. They come from unchallenged assumptions.

This is where thoughtful, independent testing becomes essential. Not as a fallback, but as an external perspective. A way to step outside the system and ask whether it actually makes sense.

We will explore why intuition, that sense that “this feels wrong”, is not guesswork, but a form of expertise built from exposure to real systems, real failures, and real users.

This is not a nostalgic defense of manual QA. It is a reframing. In a world where code is abundant, **good judgment becomes the bottleneck**.

Python is not unique here. It amplifies the problem. Its central role in AI workflows, combined with low friction and weakly specified correctness in data and ML systems, makes it especially easy to produce code that is internally consistent but externally wrong. It is less an exception than a preview of where software is heading.

Correctness didn’t get easier to prove — we just made it easier to agree on. As expectations rise, we risk mistaking consensus for correctness.
