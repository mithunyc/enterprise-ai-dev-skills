# Security Triggers

> Buildloop public reference for security triggers and escalation points.

---

## Trigger Model

Security review is trigger-based, not optional.

When a phase touches a security-sensitive area, the checks below apply. They are not a checklist to skim — they are conditions that must be verified before the phase can be considered complete.

---

## Triggers and Required Checks

### Auth or Authorization

If the phase touches authentication or authorization:

- Verify server-side enforcement (client-side checks alone are insufficient)
- Verify default-deny behavior where relevant
- Verify token and session handling assumptions

### Data Stores or Migrations

If the phase touches data stores or migrations:

- Verify parameterization (no string interpolation in queries)
- Verify least-privilege assumptions (does the role have more access than needed?)
- Verify migration safety and rollback path

### User Input or Rendering

If the phase touches user input or rendered output:

- Verify input validation
- Verify encoding and sanitization expectations
- Verify upload size and type handling if applicable

### External Integrations

If the phase touches external services or webhooks:

- Verify secret handling (no secrets in logs or client-side code)
- Verify retries and timeouts are implemented
- Verify webhook authenticity checks if applicable

### Payments, PII, Health, or Regulated Data

If the phase touches payments, personally identifiable information, health data, or data subject to regulatory requirements:

- Verify data minimization assumptions (only collect what is needed)
- Name logging and audit expectations if visible
- Recommend human review before production deploy

---

## Allowed Security Conclusions

Use exactly one of these conclusions in the receipt for any security-sensitive phase:

- **Verified with evidence** — checks performed, proof attached
- **Partially verified** — some checks performed, gaps documented
- **Not deeply verified** — surface review only, depth insufficient

If "not deeply verified" applies to auth, payments, PII, or regulated data, the receipt must include:

```text
RECOMMEND HUMAN SECURITY REVIEW BEFORE PRODUCTION DEPLOY
```

Never say "secure" based only on a surface review.

This exists because checkbox security is worse than honest uncertainty.

---

*Source: buildloop/reference/security-triggers.md*
