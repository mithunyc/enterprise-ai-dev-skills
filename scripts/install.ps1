param(
  [ValidateSet("codex", "claude", "cursor", "antigravity", "all")]
  [string[]]$Target = @("codex"),

  [ValidateSet("minimal", "core", "full", "contributor")]
  [string]$Mode = "core",

  [switch]$Force,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# ── Skill lists per mode ────────────────────────────────────────────────────
$LocalSkillsByMode = @{
  minimal     = @("enterprise-ai-dev", "karpathy-guidelines")
  core        = @("enterprise-ai-dev", "karpathy-guidelines", "awesome-design-md", "caveman")
  full        = @("enterprise-ai-dev", "karpathy-guidelines", "awesome-design-md", "caveman", "grill-me")
  contributor = @()  # Not auto-installed; see CONTRIBUTING.md
}

$UpstreamByMode = @{
  minimal = @{
    "mattpocock/skills" = @("skills/engineering/tdd", "skills/engineering/diagnose")
    "obra/superpowers"  = @("skills/brainstorming")
  }
  core = @{
    "mattpocock/skills" = @(
      "skills/engineering/tdd", "skills/engineering/diagnose",
      "skills/engineering/grill-with-docs", "skills/engineering/to-prd"
    )
    "obra/superpowers"  = @(
      "skills/brainstorming", "skills/writing-plans", "skills/executing-plans",
      "skills/verification-before-completion"
    )
    "openai/skills"     = @("skills/.curated/security-best-practices")
  }
  full = @{
    "mattpocock/skills" = @(
      "skills/engineering/tdd", "skills/engineering/diagnose",
      "skills/engineering/grill-with-docs", "skills/engineering/to-prd",
      "skills/engineering/improve-codebase-architecture", "skills/engineering/zoom-out",
      "skills/engineering/setup-matt-pocock-skills"
    )
    "obra/superpowers"  = @(
      "skills/brainstorming", "skills/writing-plans", "skills/executing-plans",
      "skills/verification-before-completion", "skills/requesting-code-review",
      "skills/finishing-a-development-branch"
    )
    "openai/skills"     = @("skills/.curated/security-best-practices", "skills/.curated/security-threat-model")
  }
  contributor = @{}
}

# ── Target resolution ───────────────────────────────────────────────────────
function Resolve-SkillsDirs {
  param([string[]]$Targets)
  $expanded = @()
  foreach ($t in $Targets) {
    if ($t -eq "all") { $expanded += @("codex", "claude", "cursor", "antigravity") }
    else              { $expanded += $t }
  }
  $dirs = @()
  foreach ($t in ($expanded | Select-Object -Unique)) {
    switch ($t) {
      "codex"       { $dirs += [pscustomobject]@{ Target=$t; Path=if($env:CODEX_HOME){Join-Path $env:CODEX_HOME "skills"}else{Join-Path $HOME ".codex\skills"} } }
      "claude"      { $dirs += [pscustomobject]@{ Target=$t; Path=Join-Path $HOME ".claude\skills" } }
      "cursor"      { $dirs += [pscustomobject]@{ Target=$t; Path=Join-Path $HOME ".cursor\skills" } }
      "antigravity" { $dirs += [pscustomobject]@{ Target=$t; Path=Join-Path $HOME ".gemini\antigravity\skills" } }
    }
  }
  return $dirs
}

# ── Conflict detection ──────────────────────────────────────────────────────
function Get-ConflictReport {
  param([string]$DestRoot, [string[]]$IncomingSkills)
  $conflicts = @()
  foreach ($skill in $IncomingSkills) {
    $dest = Join-Path $DestRoot $skill
    if (Test-Path $dest) {
      $conflicts += $skill
    }
  }
  return $conflicts
}

function Get-GovernanceConflicts {
  param([string]$ProjectRoot)
  $found = @()
  $checks = @("AGENTS.md", "CLAUDE.md", ".cursorrules", "tasks/STATE.md")
  foreach ($f in $checks) {
    if (Test-Path (Join-Path $ProjectRoot $f)) { $found += $f }
  }
  return $found
}

# ── Copy helpers ────────────────────────────────────────────────────────────
function Copy-Skill {
  param([string]$Source, [string]$Name, [string]$DestRoot)
  $dest = Join-Path $DestRoot $Name
  if ((Test-Path $dest) -and -not $Force) {
    Write-Host "  skip  $Name (exists; use -Force to overwrite)"
    return
  }
  if ($DryRun) { Write-Host "  dry   $Name -> $dest"; return }
  if (Test-Path $dest) { Remove-Item -Recurse -Force -LiteralPath $dest }
  Copy-Item -Recurse -Force -LiteralPath $Source -Destination $dest
  Normalize-Skill $dest
  Write-Host "  added $Name"
}

function Normalize-Skill {
  param([string]$SkillPath)
  $md = Join-Path $SkillPath "SKILL.md"
  if (-not (Test-Path $md)) { throw "Missing SKILL.md in $SkillPath" }
  $content = Get-Content -Raw -LiteralPath $md
  $content = $content -replace "(?m)^disable-model-invocation:\s*true\r?\n", ""
  Set-Content -NoNewline -Encoding UTF8 -LiteralPath $md -Value $content
}

function Install-FromRepo {
  param([string]$Repo, [string[]]$Paths, [string]$DestRoot)
  $temp = Join-Path ([System.IO.Path]::GetTempPath()) ("ead-skills-" + [Guid]::NewGuid().ToString("N"))
  Write-Host "  cloning $Repo..."
  git clone --depth 1 "https://github.com/$Repo.git" $temp 2>&1 | Out-Null
  try {
    foreach ($path in $Paths) {
      $source = Join-Path $temp $path
      if (-not (Test-Path $source)) {
        Write-Warning "  Path not found in ${Repo}: $path — skipping"
        continue
      }
      $name = Split-Path $path -Leaf
      Copy-Skill -Source $source -Name $name -DestRoot $DestRoot
    }
  }
  finally {
    Remove-Item -Recurse -Force -LiteralPath $temp -ErrorAction SilentlyContinue
  }
}

# ── Main ────────────────────────────────────────────────────────────────────
$repoRoot  = Resolve-Path (Join-Path $PSScriptRoot "..")
$destRoots = Resolve-SkillsDirs $Target

Write-Host ""
Write-Host "enterprise-ai-dev-skills installer"
Write-Host "  Mode   : $Mode"
Write-Host "  Target : $($Target -join ', ')"
if ($DryRun) { Write-Host "  DRY RUN — no files will be written" }
Write-Host ""

foreach ($dest in $destRoots) {
  New-Item -ItemType Directory -Force -Path $dest.Path | Out-Null

  # ── Conflict report ──────────────────────────────────────────────────────
  $allSkillNames = $LocalSkillsByMode[$Mode] + ($UpstreamByMode[$Mode].Values | ForEach-Object { $_ | ForEach-Object { Split-Path $_ -Leaf } })
  $skillConflicts = Get-ConflictReport -DestRoot $dest.Path -IncomingSkills $allSkillNames
  if ($skillConflicts.Count -gt 0) {
    Write-Host "CONFLICT REPORT for $($dest.Target):"
    foreach ($c in $skillConflicts) { Write-Host "  - $c already installed (will skip unless -Force)" }
    Write-Host ""
  }

  # ── Local skills ─────────────────────────────────────────────────────────
  Write-Host "[$($dest.Target)] Installing local skills ($Mode mode)..."
  foreach ($skillName in $LocalSkillsByMode[$Mode]) {
    $source = Join-Path $repoRoot "skills\$skillName"
    if (-not (Test-Path $source)) {
      Write-Warning "  Local skill not found: $skillName — skipping"
      continue
    }
    Copy-Skill -Source $source -Name $skillName -DestRoot $dest.Path
  }

  # ── Upstream skills ──────────────────────────────────────────────────────
  Write-Host ""
  Write-Host "[$($dest.Target)] Installing upstream skills ($Mode mode)..."
  foreach ($repo in $UpstreamByMode[$Mode].Keys) {
    $paths = $UpstreamByMode[$Mode][$repo]
    if ($paths.Count -gt 0) {
      Install-FromRepo -Repo $repo -Paths $paths -DestRoot $dest.Path
    }
  }

  Write-Host ""
}

Write-Host "Done. Restart your AI coding agent to pick up new skills."
Write-Host ""
Write-Host "Install modes available: minimal | core (default) | full | contributor"
Write-Host "Usage: .\scripts\install.ps1 -Target antigravity -Mode full"
