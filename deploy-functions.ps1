# deploy-functions.ps1
# Run this script from the project root to deploy all Supabase Edge Functions

Write-Host "=== Kisaan Bandhu - Supabase Edge Functions Deployment ===" -ForegroundColor Cyan

Write-Host "`n[0/4] Checking Supabase CLI..." -ForegroundColor Yellow
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Supabase CLI is not installed or is not available in PATH." -ForegroundColor Red
    Write-Host "Please install it by running: npm install -g supabase" -ForegroundColor Yellow
    Write-Host "Or via Scoop (Windows Native): scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase" -ForegroundColor Yellow
    Write-Host "Then restart PowerShell." -ForegroundColor Yellow
    exit 1
}

$supabaseVersion = supabase --version
Write-Host "Supabase CLI found: $supabaseVersion" -ForegroundColor Green

Write-Host "`n[1/4] Authenticating with Supabase..." -ForegroundColor Yellow
if (-not $env:SUPABASE_ACCESS_TOKEN) {
    Write-Host "SUPABASE_ACCESS_TOKEN not set. Please set it before running:" -ForegroundColor Red
    Write-Host '  $env:SUPABASE_ACCESS_TOKEN = "sbp_your_token_here"' -ForegroundColor Yellow
    Write-Host "Generate one at: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}
Write-Host "Token found. Verifying..." -ForegroundColor Gray
$null = supabase projects list 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Reason: Invalid access token. Generate a new one at https://supabase.com/dashboard/account/tokens" -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host "`n[2/4] Linking to Supabase project..." -ForegroundColor Yellow
supabase link --project-ref dvppomddttreososgrhm
if ($LASTEXITCODE -ne 0) {
    Write-Host "DEPLOYMENT FAILED" -ForegroundColor Red
    Write-Host "Reason: Failed to link to Supabase project 'dvppomddttreososgrhm'." -ForegroundColor Red
    exit 1
}
Write-Host "SUCCESS" -ForegroundColor Green

Write-Host "`n[3/4] Setting secret environment variables..." -ForegroundColor Yellow
$envFile = Get-Content ".env" | Where-Object { $_ -match "^[A-Z_]+=.+" -and $_ -notmatch "^VITE_" -and $_ -notmatch "^SUPABASE_" -and $_ -notmatch "^#" }
foreach ($line in $envFile) {
  $parts = $line -split "=", 2
  $key   = $parts[0].Trim()
  $value = $parts[1].Trim()
  Write-Host "  Setting $key... " -NoNewline -ForegroundColor Gray

  # Hide output and prevent printing secret values
  $result = supabase secrets set "$key=$value" 2>&1
  if ($LASTEXITCODE -ne 0) {
      Write-Host "FAILED" -ForegroundColor Red
      Write-Host "Supabase error: $result" -ForegroundColor Red
      Write-Host "`nDEPLOYMENT FAILED" -ForegroundColor Red
      Write-Host "Reason: Failed to set secret for $key." -ForegroundColor Red
      exit 1
  }
  Write-Host "SUCCESS" -ForegroundColor Green
}

Write-Host "`n[4/4] Deploying Edge Functions..." -ForegroundColor Yellow
$functions = @(
  "chat",
  "voice-to-text",
  "voice-token",
  "disease-detection",
  "finance-schemes",
  "weather-alerts",
  "profile",
  "fields"
)

foreach ($fn in $functions) {
  Write-Host "  Deploying: $fn... " -NoNewline -ForegroundColor Gray
  $null = supabase functions deploy $fn --no-verify-jwt 2>&1
  if ($LASTEXITCODE -ne 0) {
      Write-Host "FAILED" -ForegroundColor Red
      Write-Host "`nDEPLOYMENT FAILED" -ForegroundColor Red
      Write-Host "Function: $fn" -ForegroundColor Red
      Write-Host "Reason: Failed to deploy function." -ForegroundColor Red
      exit 1
  }
  Write-Host "SUCCESS" -ForegroundColor Green
}

Write-Host "`n=== Deployment Complete ===" -ForegroundColor Cyan
Write-Host "All functions deployed successfully!" -ForegroundColor Green
Write-Host "Base URL: https://dvppomddttreososgrhm.supabase.co/functions/v1/" -ForegroundColor Cyan
