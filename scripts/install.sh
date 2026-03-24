#!/usr/bin/env bash
set -euo pipefail

FORCE="${FORCE:-0}"
TARGETS="${TARGETS:-codex}"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE=1
      shift
      ;;
    --target)
      TARGETS="${2:-codex}"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: scripts/install.sh [--target codex|claude|cursor|antigravity|all] [--force]" >&2
      exit 1
      ;;
  esac
done

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

resolve_dest_roots() {
  local targets="$1"
  local expanded=()
  IFS=',' read -ra requested <<< "$targets"
  for target in "${requested[@]}"; do
    case "$target" in
      all)
        expanded+=(codex claude cursor antigravity)
        ;;
      codex|claude|cursor|antigravity)
        expanded+=("$target")
        ;;
      *)
        echo "Unknown target: $target" >&2
        exit 1
        ;;
    esac
  done

  printf '%s\n' "${expanded[@]}" | awk '!seen[$0]++'
}

target_to_dir() {
  local target="$1"
  case "$target" in
    codex) echo "${CODEX_HOME:-$HOME/.codex}/skills" ;;
    claude) echo "$HOME/.claude/skills" ;;
    cursor) echo "$HOME/.cursor/skills" ;;
    antigravity) echo "$HOME/.gemini/antigravity/skills" ;;
  esac
}

target_tier() {
  case "$1" in
    codex|claude) echo "proven" ;;
    cursor|antigravity) echo "experimental" ;;
  esac
}

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
  local dest_root="$3"
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
  local dest_root="$2"
  shift 2
  local temp
  temp="$(mktemp -d)"
  git clone --depth 1 "https://github.com/$repo.git" "$temp"
  for path in "$@"; do
    local source="$temp/$path"
    [[ -d "$source" ]] || { echo "Path not found in $repo: $path" >&2; rm -rf "$temp"; exit 1; }
    copy_skill "$source" "$(basename "$path")" "$dest_root"
  done
  rm -rf "$temp"
}

mapfile -t resolved_targets < <(resolve_dest_roots "$TARGETS")

for target in "${resolved_targets[@]}"; do
  dest_root="$(target_to_dir "$target")"
  mkdir -p "$dest_root"
  if [[ "$(target_tier "$target")" == "experimental" ]]; then
    echo "NOTE: $target support is experimental; verify your agent loads SKILL.md from $dest_root."
  fi

  echo
  echo "Installing local skills for $target -> $dest_root"
  copy_skill "$repo_root/skills/enterprise-ai-dev" "enterprise-ai-dev" "$dest_root"
  copy_skill "$repo_root/skills/awesome-design-md" "awesome-design-md" "$dest_root"

  echo
  echo "Installing upstream skills for $target"
  install_from_repo "mattpocock/skills" "$dest_root" \
  "skills/engineering/setup-matt-pocock-skills" \
  "skills/engineering/grill-with-docs" \
  "skills/engineering/to-prd" \
  "skills/engineering/tdd" \
  "skills/engineering/diagnose" \
  "skills/engineering/improve-codebase-architecture" \
  "skills/engineering/zoom-out"

  install_from_repo "obra/superpowers" "$dest_root" \
  "skills/brainstorming" \
  "skills/writing-plans" \
  "skills/test-driven-development" \
  "skills/executing-plans" \
  "skills/systematic-debugging" \
  "skills/requesting-code-review" \
  "skills/verification-before-completion" \
  "skills/finishing-a-development-branch"

  install_from_repo "openai/skills" "$dest_root" \
  "skills/.curated/security-best-practices" \
  "skills/.curated/security-threat-model"

  install_from_repo "Yeachan-Heo/oh-my-codex" "$dest_root" \
  "skills/security-review" \
  "skills/frontend-ui-ux" \
  "skills/visual-verdict"
done

echo
echo "Done. Restart your AI coding agent to pick up new skills."
