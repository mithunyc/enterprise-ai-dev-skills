param(
  [ValidateSet("codex", "claude", "cursor", "antigravity", "all")]
  [string[]]$Target = @("codex"),
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$repoZip = "https://github.com/mithunyc/enterprise-ai-dev-skills/archive/refs/heads/main.zip"
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) ("enterprise-ai-dev-skills-" + [Guid]::NewGuid().ToString("N"))
$zipPath = Join-Path $tempRoot "repo.zip"

New-Item -ItemType Directory -Force -Path $tempRoot | Out-Null

try {
  Invoke-WebRequest -Uri $repoZip -OutFile $zipPath
  Expand-Archive -LiteralPath $zipPath -DestinationPath $tempRoot -Force
  $repoRoot = Get-ChildItem -Path $tempRoot -Directory | Where-Object { $_.Name -like "enterprise-ai-dev-skills-*" } | Select-Object -First 1
  if (-not $repoRoot) {
    throw "Could not find extracted repo directory."
  }

  $installScript = Join-Path $repoRoot.FullName "scripts\install.ps1"
  & $installScript -Target $Target -Force:$Force
}
finally {
  Remove-Item -Recurse -Force -LiteralPath $tempRoot -ErrorAction SilentlyContinue
}
