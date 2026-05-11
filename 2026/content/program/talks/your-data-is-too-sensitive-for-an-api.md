---
title: 'Your Data Is Too Sensitive for an API: Fine-Tuning an Open-Source LLM for Production Document Parsing'
page_type: talk
code: DKNDRZ
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Your Data Is Too Sensitive for an API
speakers:
  - name: Ross Katz
    slug: ross-katz
    code: SZ79EQ
    avatar: /2026/img/speakers/ross-katz.webp
og_image: https://www.pyohio.org/2026/img/og/talks/your-data-is-too-sensitive-for-an-api.png
---

Our client needed to parse thousands of messy, freetext documents into structured JSON every day. The data was too sensitive to send to a third-party API. So we fine-tuned an open-source 8B parameter model, deployed it on our own infrastructure, and built a Python pipeline around it that now runs in production with automated monthly retraining.
 
This talk is the full blueprint. I'll walk through every stage: a Django + Pydantic QA portal for curating high-quality training data, synthetic data generation at scale via BigQuery, fine-tuning with Axolotl and LoRA adapters (yes, on consumer GPUs), a DuckDB-powered benchmark framework that gates every model release, and a FastAPI + Docker deployment that keeps the whole thing running without anyone babysitting it. No API keys. No vendor lock-in. Just Python, open-source models, and a lot of iteration. If you've ever wanted to move beyond prompt engineering and actually own your model end to end, this talk will show you how.
