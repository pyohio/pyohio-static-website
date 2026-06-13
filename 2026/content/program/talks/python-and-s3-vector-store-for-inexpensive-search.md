---
title: Python and S3 Vector Store for Inexpensive Search
page_type: talk
code: MUZMHK
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Python and S3 Vector Store for Inexpensive Search
speakers:
  - name: Michael James Robellard
    slug: michael-james-robellard
    code: 93D97P
start: '2026-07-25T10:15:00-04:00'
end: '2026-07-25T10:45:00-04:00'
room: Ballroom C
slot_label: Saturday at 10:15 AM
og_image: https://www.pyohio.org/2026/img/og/talks/python-and-s3-vector-store-for-inexpensive-search.png
---

Vector databases are the hot new infrastructure tax — Pinecone, Weaviate, and managed OpenSearch all want $70-300+/month before you've stored a single embedding. In this talk, I'll show how we replaced a planned vector database with AWS S3 Vectors — a new S3 feature that stores and queries embeddings directly in S3 buckets — to power semantic search across millions of genealogical records using Python and Cohere embeddings via AWS Bedrock, all for under $1/month.

I'll cover how S3 Vectors works under the hood, walk through a live Python implementation (embedding generation, indexing pipeline, and query interface), share real production cost comparisons against OpenSearch Serverless and Pinecone, and discuss when S3 Vectors is the right choice vs. a dedicated vector DB. This talk is for Python developers who want to add semantic search to their applications without adding another expensive managed service to their stack.
