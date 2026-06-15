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
start: '2026-07-25T14:15:00-04:00'
end: '2026-07-25T14:45:00-04:00'
room: Ballroom C
slot_label: Saturday at 2:15 PM
og_image: https://www.pyohio.org/2026/img/og/talks/in-defense-of-thoughtful-testing.png
---

AI can now generate working code in seconds, often complete with tests. But something subtle is breaking: passing tests is no longer a strong signal of correctness. 

For decades, software development relied on a simple assumption: creating solutions is hard, but verifying them is relatively easy. Sudoku is the canonical example. Solving a difficult puzzle can take significant effort, but once a solution is produced, verifying it is trivial.

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

AI changes that model. In Python workflows especially, it is now common to generate code, generate tests for that code, run CI, and receive a green checkmark without ever meaningfully challenging the underlying assumptions. The result is often not correctness. It is self consistency.

This talk argues that as code generation becomes abundant, judgment becomes the bottleneck. We already see systems that pass every automated test while still failing users, APIs that return the correct shape but the wrong meaning, and data pipelines that produce valid outputs but incorrect conclusions. These failures emerge from closed loops of validation that never step outside themselves.

Thoughtful, independent testing therefore becomes more important, not less. AI did not make correctness easier to establish. It simply made agreement easier to produce.
