---
title: How I ship more with AI
date: 2026-10-21
summary: I use AI as a partner when I'm learning and as an agent when I already know what I want. I try to know which one I'm doing.
---

# AI helps me ship more (2x more!)

Shipping twice as many tickets sounds like the whole story. It isn't. Writing code got cheaper, but trusting it didn't.

Recently I read [The Complete Guide to pstack](https://x.com/poteto/status/2094457600259842065) by lauren, who works on the React Compiler. Her main point is that the most important thing you can give an agent is a way to verify its own work. That matched what I had learned the slow way: the speed only counts if I can trust what ships.

The 2x is real, but it is not a benchmark. I used to close around 2-3 tickets a week, and now it is about double that. I haven't had a moment where I accepted code I couldn't explain, and I'd like to keep it that way. That is why I use AI for two different things, and they need different rules.

As a partner, I let it explore for me. At work I deal with WHMCS hooks, its API and behavior I didn't build. I ask the agent to look through the current flow and tell me which hooks exist, which API calls fit, and how the system behaves today. It gives me a guess based on what it found. Then I check the guess against the real flow, or I ask my senior. I don't treat the answer as a fact until I have seen it.

As an agent, I let it change files. I give it repetitive edits, a new component based on an existing pattern, a mock service to reproduce a bug, and tests. This is where it is easiest to get lazy, so I don't rely on my eyes alone. I check the change against the specs, and I load skills from people I trust and follow: currently Matt Pocock and lauren tan. The skills keep the agent close to our codebase and give it a way to check its own work, so I'm not the only line of defense.

There are things I never give it. Production access, anything that alters a business process, and over-engineering. A diff that looks right is not the same as code I understand, and I can't afford code I can't explain.

I think the first way is useful for learning and the second is useful for speed, and they should not be mixed up. If I ask the agent to do something I don't understand, I get code I can't explain.

What I don't want to lose is the slow part. Reading someone else's code, tracing a bug for longer than is comfortable, working out why something exists. That is how I learned most of what I know, and AI can remove that work very easily. So I still do some of it by hand, not often and not much, like writing a query myself when I want to.

My AI agents sometimes still fails, and usually because of me. When I'm the bottleneck and can't give it enough context, or a mockup to test against, the agent has nothing to verify with and the result drifts. Better context gets better output.

In the end, the speed is only a side effect. What I'm after is shipping things I can confidently confirm to stakeholders.
