# deploy-functions.ps1
# Run this script from the project root to deploy all Supabase Edge Functions
# Prerequisites: Supabase CLI installed (npm i -g supabase)

Write-Host "=== Kisaan Bandhu — Supabase Edge Functions Deployment ===" -ForegroundColor Cyan

# Step 1: Login (will open browser)
Write-Host "`n[1/4] Logging in to Supabase..." -ForegroundColor Yellow
supabase login

# Step 2: Link project
Write-Host "`n[2/4] Linking to Supabase project..." -ForegroundColor Yellow
supabase link --project-ref qnmygtujnvlrcwblmqvd

# Step 3: Set secrets
Write-Host "`n[3/4] Setting secret environment variables..." -ForegroundColor Yellow

# Load from .env file
$envFile = Get-Content ".env" | Where-Object { $_ -match "^[A-Z_]+=.+" -and $_ -notmatch "^VITE_" -and $_ -notmatch "^#" }
foreach ($line in $envFile) {
  $parts = $line -split "=", 2
  $key   = $parts[0].Trim()
  $value = $parts[1].Trim()
  Write-Host "  Setting $key" -ForegroundColor Gray
  supabase secrets set "$key=$value"
}

# Step 4: Deploy all functions
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
  Write-Host "  Deploying: $fn" -ForegroundColor Gray
  supabase functions deploy $fn --no-verify-jwt
}

Write-Host "`n✅ All functions deployed!" -ForegroundColor Green
Write-Host "Base URL: https://qnmygtujnvlrcwblmqvd.supabase.co/functions/v1/" -ForegroundColor Cyan
