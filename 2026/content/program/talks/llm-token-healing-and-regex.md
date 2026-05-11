---
title: 'LLM Token Healing and Regex: Free Gains You Leave on the Table'
page_type: talk
code: 8TE7QA
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: LLM Token Healing and Regex
speakers:
  - name: Abraham Owodunni
    slug: abraham-owodunni
    code: URUUMZ
    avatar: /2026/img/speakers/abraham-owodunni.webp
og_image: https://www.pyohio.org/2026/img/og/talks/llm-token-healing-and-regex.png
---

LLMs break text into chunks called tokens before they do anything with it. The way that splitting happens can quietly hurt your results, and most people never notice. In this talk, I'll cover two simple techniques that can improve LLM output quality without any training or fine-tuning. The first, token healing, fixes a common problem where the boundary between your prompt and the model's response lands in an awkward spot, confusing the model. The second is choosing a better splitting pattern for how text gets chunked into tokens in the first place. I'll show both techniques in Python, explain why they work, and share benchmark results across several open-weight LLMs.
