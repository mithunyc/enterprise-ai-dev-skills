#!/usr/bin/env bash
set -euo pipefail

FORCE="${FORCE:-0}"
if [[ "${1:-}" == "--force" ]]; then
  FORCE=1
fi

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
dest_root="${CODEX_HOME:-$HOME/.codex}/skills"
mkdir -p "$dest_root"

normalize_skill() {
  local skill_path="$1"
  local skill_md="$skill_path/SKILL.md"
  [[ -f "$skill_md" ]] || { echo "Missing SKILL.md in $skill_path" >&2; exit 1; }
  sed -i.bak '/^disable-model-invocation:[[:space:]]*true$/d' "$skill_md"
  rm -f "$skill_md.bak"
}

copy_skill() {
  local source="$1"
  local name="$2"
  local dest="$dest_root/$name"

  if [[ -e "$dest" && "$FORCE" != "1" ]]; then
    echo "skip $name (already installed; use --force to overwrite)"
    return
  fi
  rm -rf "$dest"
  mkdir -p "$(dirname "$dest")"
  cp -R "$source" "$dest"
  normalize_skill "$dest"
  echo "installed $name"
}

install_from_repo() {
  local repo="$1"
  shift
  local temp
  temp="$(mktemp -d)"
  git clone --depth 1 "https://github.com/$repo.git" "$temp"
  for path in "$@"; do
    local source="$temp/$path"
    [[ -d "$source" ]] || { echo "Path not found in $repo: $path" >&2; rm -rf "$temp"; exit 1; }
    copy_skill "$source" "$(basename "$path")"
  done
  rm -rf "$temp"
}

copy_skill "$repo_root/skills/enterprise-ai-dev" "enterprise-ai-dev"
copy_skill "$repo_root/skills/awesome-design-md" "awesome-design-md"

install_from_repo "mattpocock/skills" \
  "skills/engineering/setup-matt-pocock-skills" \
  "skills/engineering/grill-with-docs" \
  "skills/engineering/to-prd" \
  "skills/engineering/tdd" \
  "skills/engineering/diagnose" \
  "skills/engineering/improve-codebase-architecture" \
  "skills/engineering/zoom-out"

install_from_repo "obra/superpowers" \
  "skills/brainstorming" \
  "skills/writing-plans" \
  "skills/test-driven-development" \
  "skills/executing-plans" \
  "skills/systematic-debugging" \
  "skills/requesting-code-review" \
  "skills/verification-before-completion" \
  "skills/finishing-a-development-branch"

install_from_repo "openai/skills" \
  "skills/.curated/security-best-practices" \
  "skills/.curated/security-threat-model"

install_from_repo "Yeachan-Heo/oh-my-codex" \
  "skills/security-review" \
  "skills/frontend-ui-ux" \
  "skills/visual-verdict"

echo
echo "Done. Restart Codex to pick up new skills."
