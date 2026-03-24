#!/usr/bin/env bash
set -euo pipefail

target="${TARGETS:-codex}"
force_args=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --target)
      target="${2:-codex}"
      shift 2
      ;;
    --force)
      force_args+=(--force)
      shift
      ;;
    *)
      echo "Unknown argument: $1" >&2
      echo "Usage: bootstrap.sh [--target codex|claude|cursor|antigravity|all] [--force]" >&2
      exit 1
      ;;
  esac
done

repo_tar="https://github.com/mithunyc/enterprise-ai-dev-skills/archive/refs/heads/main.tar.gz"
temp_root="$(mktemp -d)"

cleanup() {
  rm -rf "$temp_root"
}
trap cleanup EXIT

archive="$temp_root/repo.tar.gz"

if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$repo_tar" -o "$archive"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$archive" "$repo_tar"
else
  echo "Need curl or wget to download the installer." >&2
  exit 1
fi

tar -xzf "$archive" -C "$temp_root"
repo_root="$(find "$temp_root" -maxdepth 1 -type d -name 'enterprise-ai-dev-skills-*' | head -n 1)"
[[ -n "$repo_root" ]] || { echo "Could not find extracted repo directory." >&2; exit 1; }

bash "$repo_root/scripts/install.sh" --target "$target" "${force_args[@]}"
