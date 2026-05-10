param(
  [ValidateSet("codex", "claude", "cursor", "antigravity", "all")]
  [string[]]$Target = @("codex"),

  [ValidateSet("minimal", "core", "full", "contributor")]
  [string]$Mode = "core",

  [switch]$Force,
  [switch]$DryRun
)

$ErrorActionPreference = "Stop"

# -- Skill lists per mode ---------------------------------------------------
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
      "skills/engineering/triage",
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
  contributor = @{
    "mattpocock/skills" = @("skills/productivity/write-a-skill")
  }
}

# -- Target resolution ------------------------------------------------------
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

# -- Conflict detection -----------------------------------------------------
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

# -- Copy helpers -----------------------------------------------------------
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

function Test-FullSha {
  param([string]$Value)
  return $Value -match "^[0-9a-fA-F]{40}$"
}

function Get-PinnedCommit {
  param([string]$Repo)
  $repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
  $manifestPath = Join-Path $repoRoot "curated-skills.json"
  $manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
  $entry = @($manifest.upstreamSkills | Where-Object { $_.repo -eq $Repo } | Select-Object -First 1)

  if (-not $entry) {
    throw "Missing upstream repo in curated-skills.json: $Repo"
  }

  $commit = [string]$entry.commit
  if (-not $commit) {
    throw "Missing pinned commit in curated-skills.json for $Repo"
  }

  return $commit
}

function Invoke-Git {
  param([string[]]$Arguments)
  $output = & git @Arguments 2>&1
  if ($LASTEXITCODE -ne 0) {
    $message = ($output | Out-String).Trim()
    if (-not $message) { $message = "git $($Arguments -join ' ') failed" }
    throw $message
  }
  return $output
}

function Install-FromRepo {
  param([string]$Repo, [string[]]$Paths, [string]$DestRoot)
  $pinnedCommit = Get-PinnedCommit -Repo $Repo
  if (-not (Test-FullSha $pinnedCommit)) {
    throw "Refusing to install ${Repo}: curated-skills.json commit must be a full 40-character SHA, got '$pinnedCommit'."
  }

  if ($DryRun) {
    Write-Host "  pin   $Repo@$pinnedCommit"
    foreach ($path in $Paths) {
      $name = Split-Path $path -Leaf
      Write-Host "  dry   $name -> $(Join-Path $DestRoot $name)"
    }
    return
  }

  $temp = Join-Path ([System.IO.Path]::GetTempPath()) ("ead-skills-" + [Guid]::NewGuid().ToString("N"))
  Write-Host "  fetching $Repo@$pinnedCommit..."
  try {
    Invoke-Git -Arguments @("init", "-q", $temp) | Out-Null
    Invoke-Git -Arguments @("-C", $temp, "remote", "add", "origin", "https://github.com/$Repo.git") | Out-Null
    Invoke-Git -Arguments @("-C", $temp, "fetch", "-q", "--depth", "1", "origin", $pinnedCommit) | Out-Null
    Invoke-Git -Arguments @("-C", $temp, "checkout", "-q", "--detach", $pinnedCommit) | Out-Null
    $checkedCommit = (Invoke-Git -Arguments @("-C", $temp, "rev-parse", "HEAD") | Out-String).Trim()
    if ($checkedCommit -ne $pinnedCommit) {
      throw "Pinned checkout verification failed for ${Repo}: expected $pinnedCommit, got $checkedCommit"
    }

    foreach ($path in $Paths) {
      $source = Join-Path $temp $path
      if (-not (Test-Path $source)) {
        Write-Warning "  Path not found in ${Repo}: $path - skipping"
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

# -- Main -------------------------------------------------------------------
$repoRoot  = Resolve-Path (Join-Path $PSScriptRoot "..")
$destRoots = Resolve-SkillsDirs $Target

Write-Host ""
Write-Host "buildloop installer"
Write-Host "  Mode   : $Mode"
Write-Host "  Target : $($Target -join ', ')"
if ($DryRun) { Write-Host "  DRY RUN - no files will be written" }
Write-Host ""

foreach ($dest in $destRoots) {
  New-Item -ItemType Directory -Force -Path $dest.Path | Out-Null

  # -- Conflict report ------------------------------------------------------
  $allSkillNames = $LocalSkillsByMode[$Mode] + ($UpstreamByMode[$Mode].Values | ForEach-Object { $_ | ForEach-Object { Split-Path $_ -Leaf } })
  $skillConflicts = Get-ConflictReport -DestRoot $dest.Path -IncomingSkills $allSkillNames
  if ($skillConflicts.Count -gt 0) {
    Write-Host "CONFLICT REPORT for $($dest.Target):"
    foreach ($c in $skillConflicts) { Write-Host "  - $c already installed (will skip unless -Force)" }
    Write-Host ""
  }

  # -- Local skills ---------------------------------------------------------
  Write-Host "[$($dest.Target)] Installing local skills..."
  foreach ($skillName in $LocalSkillsByMode[$Mode]) {
    $source = Join-Path $repoRoot "skills\$skillName"
    if (-not (Test-Path $source)) {
      Write-Warning "  Local skill not found: $skillName - skipping"
      continue
    }
    Copy-Skill -Source $source -Name $skillName -DestRoot $dest.Path
  }

  # -- Upstream skills ------------------------------------------------------
  Write-Host ""
  Write-Host "[$($dest.Target)] Installing upstream skills..."
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
