---
title: '“Oh, You’re Right” Is Not a Review: Orchestrating Agentic AI That Proves What It Checked'
page_type: talk
code: WKCGR9
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: “Oh, You’re Right” Is Not a Review
speakers:
  - name: Calvin Hendryx-Parker
    slug: calvin-hendryx-parker
    code: URDK3P
    avatar: /2026/img/speakers/calvin-hendryx-parker.webp
start: '2026-07-25T11:45:00-04:00'
end: '2026-07-25T12:15:00-04:00'
room: Ballroom C
slot_label: Saturday at 11:45 AM
og_image: https://www.pyohio.org/2026/img/og/talks/oh-youre-right-is-not-a-review.png
---

Have you ever run a 20-page contract through an AI and watched it miss the clause that actually mattered? You point it out and the model replies, “Oh, you’re right.” That is not a one-off. That is a structural problem, and it gets worse as the stakes get higher.

AI practitioners are under pressure to deploy AI on contracts, policies, code reviews, and other Python-powered workflows without increasing risk. Yet most teams still rely on chat-style prompts and generic tools that miss key clauses, skip steps, and make it hard to prove what was actually reviewed. 

New tool frameworks and MCP-style integrations are multiplying calls and windows, but not reliability. The result is stalled negotiations, audit anxiety, governance gaps, and persistent doubts about whether AI is safe to trust.

Calvin Hendryx-Parker, Six Feet Up CTO and AWS Hero since 2019, will walk you through a practical framework for orchestrating agentic AI systems in Python that are reliable, auditable, and ready for high-stakes use. 

You will see a live, clause-level walkthrough of an AI-driven contract review built entirely with open source Python tooling, including structured memory with SQLite and ChromaDB, lightweight agent skill definitions, and specialized subagents that route, validate, and escalate findings. The same patterns apply directly to engineering workflows like code review and test planning.

**You'll walk away knowing how to:**

- Chunk documents and tasks, frame targeted prompts, and apply checklists so each sub-task has clear acceptance criteria and traceability
- Manage context explicitly using SQLite and ChromaDB so your agents work from structured memory rather than a bloated, degraded context window
- Turn a vague "review this" into a structured series of sub-jobs including clause-level analysis, routing, and validation so nothing is silently skipped
- Build specialized agents that route, validate, and escalate rather than generating a single monolithic response
- Make AI output auditable so you can prove what was reviewed, when, and by which agent
- Apply the same agentic patterns to Python engineering workflows including code review and test planning

No chat-style demos, but a live Python-based system doing real work, and an actionable playbook you can take back to your team.
