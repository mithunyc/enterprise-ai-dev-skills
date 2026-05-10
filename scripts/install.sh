#!/usr/bin/env bash
set -euo pipefail

FORCE=0
DRY_RUN=0
TARGETS="codex"
MODE="core"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --force)
      FORCE=1
      shift
      ;;
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    --target)
      TARGETS="${2:-codex}"
      shift 2
      ;;
    --mode)
      MODE="${2:-core}"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: scripts/install.sh [--target codex|claude|cursor|antigravity|all] [--mode minimal|core|full|contributor] [--force] [--dry-run]" >&2
      exit 1
      ;;
  esac
done

# Validate mode
case "$MODE" in
  minimal|core|full|contributor) ;;
  *) echo "Unknown mode: $MODE. Valid modes: minimal, core, full, contributor." >&2; exit 1 ;;
esac

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
manifest_path="$repo_root/curated-skills.json"

is_full_sha() {
  local value="$1"
  [[ "$value" =~ ^[0-9a-fA-F]{40}$ ]]
}

get_pinned_commit() {
  local repo="$1"
  if command -v node >/dev/null 2>&1; then
    node - "$manifest_path" "$repo" <<'NODE'
const fs = require('fs');

const [manifestPath, repo] = process.argv.slice(2);
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entry = Array.isArray(manifest.upstreamSkills)
  ? manifest.upstreamSkills.find((item) => item && item.repo === repo)
  : null;

if (!entry) {
  console.error(`Missing upstream repo in curated-skills.json: ${repo}`);
  process.exit(2);
}

if (typeof entry.commit !== 'string' || entry.commit.length === 0) {
  console.error(`Missing pinned commit in curated-skills.json for ${repo}`);
  process.exit(2);
}

process.stdout.write(entry.commit);
NODE
    return
  fi

  awk -v repo="$repo" '
    BEGIN { found = 0 }
    index($0, "\"repo\"") && index($0, "\"" repo "\"") {
      found = 1
      next
    }
    found && index($0, "\"commit\"") {
      line = $0
      sub(/^.*"commit"[[:space:]]*:[[:space:]]*"/, "", line)
      sub(/".*$/, "", line)
      if (line != "") {
        print line
        exit 0
      }
    }
    END {
      if (!found) {
        print "Missing upstream repo in curated-skills.json: " repo > "/dev/stderr"
        exit 2
      }
    }
  ' "$manifest_path"
}

# -- Skill lists per mode ---------------------------------------------------
declare -A local_skills_by_mode=(
  ["minimal"]="enterprise-ai-dev karpathy-guidelines"
  ["core"]="enterprise-ai-dev karpathy-guidelines awesome-design-md caveman"
  ["full"]="enterprise-ai-dev karpathy-guidelines awesome-design-md caveman grill-me"
  ["contributor"]=""
)

declare -A upstream_mattpocock_by_mode=(
  ["minimal"]="skills/engineering/tdd skills/engineering/diagnose"
  ["core"]="skills/engineering/tdd skills/engineering/diagnose skills/engineering/grill-with-docs skills/engineering/to-prd"
  ["full"]="skills/engineering/tdd skills/engineering/diagnose skills/engineering/grill-with-docs skills/engineering/to-prd skills/engineering/triage skills/engineering/improve-codebase-architecture skills/engineering/zoom-out skills/engineering/setup-matt-pocock-skills"
  ["contributor"]="skills/productivity/write-a-skill"
)

declare -A upstream_obra_by_mode=(
  ["minimal"]="skills/brainstorming"
  ["core"]="skills/brainstorming skills/writing-plans skills/executing-plans skills/verification-before-completion"
  ["full"]="skills/brainstorming skills/writing-plans skills/executing-plans skills/verification-before-completion skills/requesting-code-review skills/finishing-a-development-branch"
  ["contributor"]=""
)

declare -A upstream_openai_by_mode=(
  ["minimal"]=""
  ["core"]="skills/.curated/security-best-practices"
  ["full"]="skills/.curated/security-best-practices skills/.curated/security-threat-model"
  ["contributor"]=""
)

# -- Target resolution ------------------------------------------------------
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

# -- Copy helpers -----------------------------------------------------------
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
    echo "  skip  $name (exists; use --force to overwrite)"
    return
  fi
  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  dry   $name -> $dest"
    return
  fi
  rm -rf "$dest"
  mkdir -p "$(dirname "$dest")"
  cp -R "$source" "$dest"
  normalize_skill "$dest"
  echo "  added $name"
}

install_from_repo() {
  local repo="$1"
  local dest_root="$2"
  shift 2
  local paths=("$@")
  local pinned_commit

  if [[ ${#paths[@]} -eq 0 ]]; then return; fi

  pinned_commit="$(get_pinned_commit "$repo")"
  if ! is_full_sha "$pinned_commit"; then
    echo "Refusing to install $repo: curated-skills.json commit must be a full 40-character SHA, got '$pinned_commit'." >&2
    exit 1
  fi

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "  pin   $repo@$pinned_commit"
    for path in "${paths[@]}"; do
      local name="$(basename "$path")"
      echo "  dry   $name -> $dest_root/$name"
    done
    return
  fi

  local temp
  temp="$(mktemp -d)"
  echo "  fetching $repo@$pinned_commit..."
  if ! git init -q "$temp"; then
    echo "git init failed for $repo" >&2
    rm -rf "$temp"
    exit 1
  fi
  if ! git -C "$temp" remote add origin "https://github.com/$repo.git"; then
    echo "git remote add failed for $repo" >&2
    rm -rf "$temp"
    exit 1
  fi
  if ! git -C "$temp" fetch -q --depth 1 origin "$pinned_commit"; then
    echo "git fetch failed for $repo@$pinned_commit" >&2
    rm -rf "$temp"
    exit 1
  fi
  if ! git -C "$temp" checkout -q --detach "$pinned_commit"; then
    echo "git checkout failed for $repo@$pinned_commit" >&2
    rm -rf "$temp"
    exit 1
  fi
  local checked_commit
  checked_commit="$(git -C "$temp" rev-parse HEAD)"
  if [[ "$checked_commit" != "$pinned_commit" ]]; then
    echo "Pinned checkout verification failed for $repo: expected $pinned_commit, got $checked_commit" >&2
    rm -rf "$temp"
    exit 1
  fi

  for path in "${paths[@]}"; do
    local source="$temp/$path"
    if [[ ! -d "$source" ]]; then
      echo "  Warning: Path not found in $repo: $path - skipping" >&2
      continue
    fi
    local name="$(basename "$path")"
    copy_skill "$source" "$name" "$dest_root"
  done
  rm -rf "$temp"
}

# -- Main -------------------------------------------------------------------
mapfile -t resolved_targets < <(resolve_dest_roots "$TARGETS")

echo
echo "enterprise-ai-dev-skills installer"
echo "  Mode   : $MODE"
echo "  Target : $TARGETS"
if [[ "$DRY_RUN" == "1" ]]; then echo "  DRY RUN - no files will be written"; fi
echo

for target in "${resolved_targets[@]}"; do
  dest_root="$(target_to_dir "$target")"
  if [[ "$DRY_RUN" != "1" ]]; then mkdir -p "$dest_root"; fi

  # Conflict detection reporting
  echo "[] Conflict Report (omitted, check manual output)..." >/dev/null

  # Local skills
  echo "[$target] Installing local skills..."
  for skill_name in ${local_skills_by_mode["$MODE"]}; do
    source="$repo_root/skills/$skill_name"
    if [[ ! -d "$source" ]]; then
      echo "  Warning: Local skill not found: $skill_name - skipping" >&2
      continue
    fi
    copy_skill "$source" "$skill_name" "$dest_root"
  done

  # Upstream skills
  echo
  echo "[$target] Installing upstream skills..."

  if [[ -n "${upstream_mattpocock_by_mode["$MODE"]}" ]]; then
    install_from_repo "mattpocock/skills" "$dest_root" ${upstream_mattpocock_by_mode["$MODE"]}
  fi

  if [[ -n "${upstream_obra_by_mode["$MODE"]}" ]]; then
    install_from_repo "obra/superpowers" "$dest_root" ${upstream_obra_by_mode["$MODE"]}
  fi

  if [[ -n "${upstream_openai_by_mode["$MODE"]}" ]]; then
    install_from_repo "openai/skills" "$dest_root" ${upstream_openai_by_mode["$MODE"]}
  fi

  echo
done

echo "Done. Restart your AI coding agent to pick up new skills."
echo
echo "Install modes available: minimal | core (default) | full | contributor"
echo "Usage: ./scripts/install.sh --target antigravity --mode full"
