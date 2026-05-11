# Contributing to buildloop

Thank you for contributing. This repo ships agent governance — everything must be deterministic, generalized, and verified.

---

## How to Write a Skill

### Skill Structure

Every skill is a folder with a required `SKILL.md`:

```
skills/your-skill-name/
├── SKILL.md           # Main instructions (required)
├── REFERENCE.md       # Detailed reference docs (if SKILL.md > 100 lines)
├── EXAMPLES.md        # Usage examples (if helpful)
└── scripts/           # Utility scripts (if needed)
    └── helper.js
```

### SKILL.md Template

```md
---
name: your-skill-name
description: One or two sentences. First: what it does. Second: "Use when [specific triggers]."
---

# Skill Name

## Quick start

[Minimal working example — what to type to invoke it]

## Workflows

[Step-by-step processes with checklists for complex tasks]

## Advanced features

[Link to separate files: See [REFERENCE.md](REFERENCE.md)]
```

### Description Requirements

The description is **the only thing the agent sees** when deciding which skill to load.
It is surfaced in the system prompt alongside all other installed skills.

**Rules:**
- Max **1024 characters**
- Write in third person
- First sentence: what the skill does
- Second sentence: `"Use when [specific triggers with keywords]"`

**Good:**
```
Diagnoses brownfield repos before feature work: runs native lint, test, and build, classifies repo state (A/B/C/D), and produces a diagnostic-baseline.md. Use when starting on an existing codebase, when the build is broken, or when health is unknown.
```

**Bad:**
```
Helps with repos.
```

The bad example gives the agent no way to distinguish this from other skills.

---

## Skill Writing Process

1. **Gather requirements** — ask:
   - What task or domain does this skill cover?
   - What specific triggers should invoke it?
   - Does it need executable scripts or just instructions?
   - Any reference materials to include?

2. **Draft the skill** — create SKILL.md using the template above. Add REFERENCE.md if content exceeds 100 lines.

3. **Generalize** — the skill must work on any stack:
   - No hardcoded tool names (use `[YOUR_LINT_COMMAND]` or list examples)
   - No project-specific paths
   - No private project names, customer names, local machine paths, or stack-specific assumptions unless explicitly marked `[CUSTOMIZE]`

4. **Review checklist** — before submitting:

| Check | Criteria |
|-------|----------|
| Description has triggers | "Use when [keyword]" is present |
| Description ≤ 1024 chars | Verified with `wc -c` |
| SKILL.md ≤ 100 lines | Or split into REFERENCE.md |
| No time-sensitive info | No "as of 2024" type statements |
| Consistent terminology | Same terms used throughout |
| Concrete examples | At least one real usage example |
| References one level deep | No deep nesting of includes |
| No banned words | `grep -i "arkaan\|supabase" SKILL.md` returns 0 |

---

## Adding Templates

Templates live in `templates/`. Every template:
- Must have valid YAML frontmatter between `---` delimiters
- Must have a `type:` field that matches its filename
- Must use `[YOUR_TOOL]` and `[CUSTOMIZE]` placeholders for project-specific values

**Verify frontmatter is valid:**
```bash
node -e "
const fs = require('fs');
const content = fs.readFileSync('templates/your-template.md', 'utf8');
const match = content.match(/^---\n([\s\S]*?)\n---/);
if (!match) { console.log('NO FRONTMATTER'); process.exit(1); }
console.log('FRONTMATTER OK');
"
```

---

## Adding Schemas

Schemas live in `schemas/`. Every schema:
- Must be valid JSON (parseable by `JSON.parse`)
- Must have `$schema`, `title`, `type: "object"`, `required: []`, and `properties: {}`
- Must use `enum` values for all constrained fields

**Verify schema is valid JSON:**
```bash
node -e "JSON.parse(require('fs').readFileSync('schemas/your-schema.json', 'utf8')); console.log('VALID')"
```

---

## Testing Locally

Before submitting a PR:

```bash
# 1. Verify all templates have frontmatter
node -e "
const fs = require('fs');
const files = fs.readdirSync('templates').map(f => 'templates/' + f);
let ok = true;
files.forEach(f => {
  if (!fs.statSync(f).isFile()) return;
  const c = fs.readFileSync(f, 'utf8');
  if (!c.match(/^---\r?\n[\s\S]*?\r?\n---/)) {
    console.log('NO FRONTMATTER: ' + f); ok = false;
  } else { console.log('OK: ' + f); }
});
process.exit(ok ? 0 : 1);
"

# 2. Verify all schemas are valid JSON
node -e "
const fs = require('fs');
const files = fs.readdirSync('schemas').map(f => 'schemas/' + f);
let ok = true;
files.forEach(f => {
  if (!f.endsWith('.json')) return;
  try { JSON.parse(fs.readFileSync(f, 'utf8')); console.log('OK: ' + f); }
  catch(e) { console.log('INVALID: ' + f + ' — ' + e.message); ok = false; }
});
process.exit(ok ? 0 : 1);
"

# 3. Check for banned words in your skill
grep -ri "arkaan\|supabase" skills/your-skill-name/ && echo "FAIL: banned words" || echo "OK: no banned words"

# 4. Check skill description length
node -e "
const fs = require('fs');
const content = fs.readFileSync('skills/your-skill-name/SKILL.md', 'utf8');
const match = content.match(/^---\n[\s\S]*?description:\s*(.+?)\n/m);
if (match) { console.log('Description length: ' + match[1].length + ' / 1024'); }
"
```

---

## PR Process

1. Fork the repo
2. Create a branch: `feat/skill-name` or `fix/description`
3. Follow the checklist above — all items must pass
4. Open a PR with:
   - What the skill/template/schema does
   - Why it's not covered by existing content
   - Verification output (paste the check results above)
5. PRs that fail any check will be rejected without review

---

## curated-skills.json

When adding a new skill to the curated registry, follow the existing tier structure:

```json
{
  "name": "your-skill-name",
  "description": "Same as SKILL.md description — must match exactly",
  "tier": "MINIMAL | CORE | FULL | CONTRIBUTOR",
  "upstream": {
    "repo": "owner/repo",
    "commit": "HEAD"
  }
}
```

**Tiers:**
| Tier | Criteria |
|------|----------|
| MINIMAL | Required for any project — foundational governance skills |
| CORE | Strongly recommended — covers 80% of common workflows |
| FULL | Complete coverage — install when project complexity warrants |
| CONTRIBUTOR | Meta-skills for repo contributors — not for project use |

---

## Code of Conduct

- Evidence outranks assertions — don't claim something works without proof
- No placeholders — every file must be complete and functional when submitted
- Generalize — your skill runs on Python, Go, JavaScript, Rust, or anything else
- Verify — run the local test commands above before opening a PR

---

*Source: buildloop/CONTRIBUTING.md | Upstream: write-a-skill/SKILL.md*
