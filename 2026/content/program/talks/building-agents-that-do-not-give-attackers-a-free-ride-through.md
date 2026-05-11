---
title: Building Agents That Do Not Give Attackers a Free Ride Through Your Infrastructure
page_type: talk
code: 8Q9KEG
duration: 30
type: 30 Minute Talk
qna: true
qna_channel: Building Agents That Do Not Give Attackers a Free Ride Through Your Infrastructure
speakers:
  - name: Advait Patel
    slug: advait-patel
    code: JPGSST
    avatar: /2026/img/speakers/advait-patel.webp
og_image: https://www.pyohio.org/2026/img/og/talks/building-agents-that-do-not-give-attackers-a-free-ride-through.png
---

Building an AI agent in Python that can call APIs, query databases, and interact with cloud services is genuinely exciting. It is also the point at which a lot of developers hand their agent a service account with broad permissions, tell themselves they will scope it down later, and then never do because the agent is working and there are other things to build.

This talk is for Python developers who are building or planning to build AI agents on Google Cloud and want to understand what the security picture actually looks like before something goes wrong rather than after. I will walk through building a realistic Python agent using the Google Cloud AI Platform and Gemini APIs, with the service account configuration done correctly from the start rather than as a retrofit.

The Python-specific parts of this talk cover the google-cloud-aiplatform library, how to use Application Default Credentials and Workload Identity Federation so your agent never holds a long-lived key, how to structure tool definitions so the agent only has access to what a specific interaction actually requires rather than everything it might ever need, and how to log what your agent is doing at a level of detail that lets you debug problems and detect abuse using the same Cloud Logging Python client you are probably already using elsewhere.

I will also show what it looks like when an agent with overly broad permissions gets manipulated into doing something it should not. Not because it is dramatic but because seeing the specific failure mode makes the defensive patterns feel concrete rather than theoretical.

If you are building agents in Python, you will leave with a working authentication pattern, a tool access structure that does not create unnecessary risk, and a logging setup that actually tells you what your agent did and why.
