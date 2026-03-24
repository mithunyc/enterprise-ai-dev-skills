---
name: awesome-design-md
description: Use curated DESIGN.md references to guide AI-generated UI and visual design. Use when building or improving frontend UI, landing pages, dashboards, design systems, visual style, brand-inspired interfaces, or when the user asks for a UI to look like a known product, company, or design reference from the VoltAgent awesome-design-md catalog.
---

# Awesome DESIGN.md

Use this skill to choose and apply a `DESIGN.md`-style design reference without loading a large design catalog into context by default.

## Workflow

1. Identify the target product category and design mood:
   - Enterprise SaaS, developer tool, fintech, consumer app, marketplace, media, automotive, AI platform, dashboard, docs, or mobile app.
   - Dense/utilitarian versus editorial/marketing versus cinematic/brand-forward.

2. Pick a reference:
   - If the user names a brand in the awesome-design-md catalog, use that brand.
   - If no brand is named, choose 1-3 suitable references and explain the tradeoff briefly.
   - Prefer references that fit the product job, not just a fashionable palette.

3. Load only the needed reference:
   - Prefer a local checkout if present in the current workspace at `repo-inspection/awesome-design-md/design-md/<brand>/README.md`.
   - Otherwise use the public catalog at `https://github.com/VoltAgent/awesome-design-md`.
   - Do not bulk-load the whole catalog.

4. Apply the design as constraints:
   - Translate colors, type scale, component styling, spacing, density, interaction patterns, and do/don't rules into implementation choices.
   - Avoid copying trademarked branding, logos, or exact protected assets unless the user owns or supplies them.
   - Keep accessibility, responsive behavior, and product usability above visual imitation.

5. Verify visually:
   - For implemented UI, inspect desktop and mobile states.
   - Check that text fits, buttons and inputs are usable, contrast is acceptable, and visual hierarchy matches the chosen reference.

## Default Reference Choices

- Enterprise operations dashboard: Linear, Airtable, IBM, HashiCorp, Sentry.
- Developer platform or API docs: Vercel, Resend, Mintlify, Replicate, OpenCode AI.
- AI product: Claude, Cohere, Mistral AI, VoltAgent, Together AI.
- Fintech or trust-heavy product: Stripe, Coinbase, Wise, Mastercard.
- Consumer marketplace or commerce: Airbnb, Shopify, Apple, Nike.
- Editorial or media: WIRED, The Verge, Spotify.

Use these as starting points, not rules.
