---
name: Don't invoke claude-api skill for project features
description: User preference on when NOT to use the claude-api skill
type: feedback
---

Do not invoke the claude-api skill when building features that use the Anthropic SDK as part of a larger application. The skill is for debugging/optimizing SDK usage, not for generating feature code.

**Why:** User explicitly rejected the skill invocation mid-Phase 4 implementation.

**How to apply:** Only invoke claude-api if the user is asking a direct question about SDK behavior, caching, or troubleshooting — not during normal feature implementation.
