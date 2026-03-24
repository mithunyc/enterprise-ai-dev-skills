param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

function Resolve-CodexSkillsDir {
  if ($env:CODEX_HOME) {
    return Join-Path $env:CODEX_HOME "skills"
  }
  return Join-Path $HOME ".codex\skills"
}

function Copy-Skill {
  param(
    [string]$Source,
    [string]$Name,
    [string]$DestRoot
  )

  $dest = Join-Path $DestRoot $Name
  if ((Test-Path $dest) -and -not $Force) {
    Write-Host "skip $Name (already installed; use -Force to overwrite)"
    return
  }
  if (Test-Path $dest) {
    Remove-Item -Recurse -Force -LiteralPath $dest
  }
  Copy-Item -Recurse -Force -LiteralPath $Source -Destination $dest
  Normalize-Skill $dest
  Write-Host "installed $Name"
}

function Normalize-Skill {
  param([string]$SkillPath)

  $skillMd = Join-Path $SkillPath "SKILL.md"
  if (-not (Test-Path $skillMd)) {
    throw "Missing SKILL.md in $SkillPath"
  }

  $content = Get-Content -Raw -LiteralPath $skillMd
  $content = $content -replace "(?m)^disable-model-invocation:\s*true\r?\n", ""
  Set-Content -NoNewline -Encoding UTF8 -LiteralPath $skillMd -Value $content
}

function Install-FromRepo {
  param(
    [string]$Repo,
    [string[]]$Paths,
    [string]$DestRoot
  )

  $temp = Join-Path ([System.IO.Path]::GetTempPath()) ("enterprise-ai-dev-skills-" + [Guid]::NewGuid().ToString("N"))
  git clone --depth 1 "https://github.com/$Repo.git" $temp | Out-Host
  try {
    foreach ($path in $Paths) {
      $source = Join-Path $temp $path
      if (-not (Test-Path $source)) {
        throw "Path not found in $Repo: $path"
      }
      $name = Split-Path $path -Leaf
      Copy-Skill -Source $source -Name $name -DestRoot $DestRoot
    }
  }
  finally {
    Remove-Item -Recurse -Force -LiteralPath $temp -ErrorAction SilentlyContinue
  }
}

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$destRoot = Resolve-CodexSkillsDir
New-Item -ItemType Directory -Force -Path $destRoot | Out-Null

Copy-Skill -Source (Join-Path $repoRoot "skills\enterprise-ai-dev") -Name "enterprise-ai-dev" -DestRoot $destRoot
Copy-Skill -Source (Join-Path $repoRoot "skills\awesome-design-md") -Name "awesome-design-md" -DestRoot $destRoot

Install-FromRepo -Repo "mattpocock/skills" -DestRoot $destRoot -Paths @(
  "skills/engineering/setup-matt-pocock-skills",
  "skills/engineering/grill-with-docs",
  "skills/engineering/to-prd",
  "skills/engineering/tdd",
  "skills/engineering/diagnose",
  "skills/engineering/improve-codebase-architecture",
  "skills/engineering/zoom-out"
)

Install-FromRepo -Repo "obra/superpowers" -DestRoot $destRoot -Paths @(
  "skills/brainstorming",
  "skills/writing-plans",
  "skills/test-driven-development",
  "skills/executing-plans",
  "skills/systematic-debugging",
  "skills/requesting-code-review",
  "skills/verification-before-completion",
  "skills/finishing-a-development-branch"
)

Install-FromRepo -Repo "openai/skills" -DestRoot $destRoot -Paths @(
  "skills/.curated/security-best-practices",
  "skills/.curated/security-threat-model"
)

Install-FromRepo -Repo "Yeachan-Heo/oh-my-codex" -DestRoot $destRoot -Paths @(
  "skills/security-review",
  "skills/frontend-ui-ux",
  "skills/visual-verdict"
)

Write-Host ""
Write-Host "Done. Restart Codex to pick up new skills."
