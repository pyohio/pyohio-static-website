---
title: Don’t Write Polars Code with a Pandas Accent
page_type: talk
code: HMYZGB
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Don’t Write Polars Code with a Pandas Accent
speakers:
  - name: Joram Mutenge
    slug: joram-mutenge
    code: ATUL7J
    avatar: /2026/img/speakers/joram-mutenge.webp
og_image: https://www.pyohio.org/2026/img/og/talks/dont-write-polars-code-with-a-pandas-accent.png
---

Many Python developers adopt Polars expecting immediate speedups, only to be disappointed when their code shows little improvement or even runs slower than pandas. The issue is not Polars, but how it's used. Writing Polars code as if it were pandas, that is, with a pandas accent, leads to confusing code and poor performance. This talk focuses on writing idiomatic Polars code instead of translating pandas patterns line by line, empowering Python developers to work efficiently with large datasets without leaving the Python ecosystem.

We will show common mistakes made by developers transitioning from pandas to Polars, such as using square bracket notation, overusing eager execution, and relying on intermediate variables. Through code examples, the talk will demonstrate how Polars promotes a different mental model built around expressions, lazy execution, and chained operations.

Attendees will learn best practices for structuring Polars pipelines, writing clear and composable expressions, and leveraging the query optimizer through chained operations. By the end of the session, participants will be able to recognize pandas-accented Polars code and confidently rewrite it to be more readable, performant, and idiomatic. More importantly, they will learn to think in Polars first, writing code that is faster and easier to maintain.

This talk is for data scientists, analysts, and engineers familiar with pandas who are beginning to explore Polars. Intermediate Polars users will learn best practices to improve code quality and performance, while beginners will gain insight into how Polars differs conceptually from pandas and why it matters.
