# GitHub Actions Setup Script for Alibaba Cloud Deployment (PowerShell)
# This script helps you configure all required secrets

param(
    [switch]$SkipAuth
)

Write-Host "🚀 GitHub Actions Setup for Alibaba Cloud Deployment" -ForegroundColor Green
Write-Host "===================================================="
Write-Host ""

# Check if gh CLI is installed
try {
    $ghVersion = gh --version | Select-Object -First 1
    Write-Host "✅ GitHub CLI found: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
    Write-Host "Please install it first: https://cli.github.com/"
    Write-Host "Or manually configure secrets in GitHub Settings → Secrets and variables → Actions"
    exit 1
}

# Authenticate with GitHub
if (-not $SkipAuth) {
    Write-Host "`n🔐 Authenticating with GitHub..." -ForegroundColor Cyan
    $authStatus = gh auth status 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Not authenticated. Logging in..." -ForegroundColor Yellow
        gh auth login
    } else {
        Write-Host "✅ Already authenticated" -ForegroundColor Green
    }
}

# Get repository info
$repoInfo = gh repo view --json owner,name | ConvertFrom-Json
$REPO_OWNER = $repoInfo.owner.login
$REPO_NAME = $repoInfo.name

Write-Host "✅ Repository: $REPO_OWNER/$REPO_NAME`n" -ForegroundColor Green

# Function to set secret
function Set-Secret {
    param(
        [string]$SecretName,
        [string]$SecretValue
    )
    
    if ([string]::IsNullOrEmpty($SecretValue)) {
        Write-Host "⚠️  Skipping $SecretName (empty value)" -ForegroundColor Yellow
        return
    }
    
    Write-Host "Setting secret: $SecretName" -NoNewline
    $secretBytes = [System.Text.Encoding]::UTF8.GetBytes($SecretValue)
    $encodedSecret = [Convert]::ToBase64String($secretBytes)
    
    # Use gh CLI to set secret
    $env:GH_SECRET_VALUE = $SecretValue
    gh secret set $SecretName --body "$SecretValue" 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
    } else {
        Write-Host " ❌" -ForegroundColor Red
    }
}

# Collect ACR credentials
Write-Host "📦 Alibaba Cloud Container Registry Configuration" -ForegroundColor Cyan
Write-Host "------------------------------------------------"
$ACR_USERNAME = Read-Host "ACR Username"
$ACR_PASSWORD = Read-Host "ACR Password" -AsSecureString
$ACR_PASSWORD_PLAIN = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ACR_PASSWORD)
)
$ACR_NAMESPACE = Read-Host "ACR Namespace"

Set-Secret -SecretName "ACR_USERNAME" -SecretValue $ACR_USERNAME
Set-Secret -SecretName "ACR_PASSWORD" -SecretValue $ACR_PASSWORD_PLAIN
Set-Secret -SecretName "ACR_NAMESPACE" -SecretValue $ACR_NAMESPACE
Write-Host ""

# Collect ECS credentials
Write-Host "🖥️  ECS Server Configuration" -ForegroundColor Cyan
Write-Host "---------------------------"
$ECS_HOST = Read-Host "ECS Public IP/Host"
$ECS_USERNAME = Read-Host "ECS Username (default: root)"
if ([string]::IsNullOrEmpty($ECS_USERNAME)) { $ECS_USERNAME = "root" }
$ECS_PORT = Read-Host "ECS SSH Port (default: 22)"
if ([string]::IsNullOrEmpty($ECS_PORT)) { $ECS_PORT = "22" }

Write-Host "`nPlease paste your SSH Private Key content:" -ForegroundColor Yellow
Write-Host "(Press Enter twice when done)"
$SSH_KEY_LINES = @()
while ($true) {
    $line = Read-Host
    if ([string]::IsNullOrEmpty($line) -and $SSH_KEY_LINES.Count -gt 0) {
        break
    }
    $SSH_KEY_LINES += $line
}
$SSH_KEY = $SSH_KEY_LINES -join "`n"

Set-Secret -SecretName "ECS_HOST" -SecretValue $ECS_HOST
Set-Secret -SecretName "ECS_USERNAME" -SecretValue $ECS_USERNAME
Set-Secret -SecretName "ECS_PORT" -SecretValue $ECS_PORT
Set-Secret -SecretName "ECS_SSH_KEY" -SecretValue $SSH_KEY
Write-Host ""

# Collect application environment variables
Write-Host "⚙️  Application Environment Variables" -ForegroundColor Cyan
Write-Host "------------------------------------"
$NEXT_PUBLIC_SITE_URL = Read-Host "Site URL (NEXT_PUBLIC_SITE_URL)"
$NEXT_PUBLIC_RFQ_ENDPOINT = Read-Host "RFQ Endpoint (optional, press Enter to skip)"
$NEXT_PUBLIC_RFQ_EMAIL = Read-Host "RFQ Email"
$ASSET_BASE_URL = Read-Host "Asset Base URL (optional, press Enter to skip)"
$NEXT_PUBLIC_ASSET_BASE_URL = Read-Host "Public Asset Base URL (optional, press Enter to skip)"
$BAIDU_TONGJI_ID = Read-Host "Baidu Tongji ID (optional, press Enter to skip)"
$NEXT_PUBLIC_BAIDU_TONGJI_ID = Read-Host "Public Baidu Tongji ID (optional, press Enter to skip)"
$TENCENT_CAPTCHA_APP_ID = Read-Host "Tencent Captcha App ID (optional, press Enter to skip)"
$NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID = Read-Host "Public Tencent Captcha App ID (optional, press Enter to skip)"

Set-Secret -SecretName "NEXT_PUBLIC_SITE_URL" -SecretValue $NEXT_PUBLIC_SITE_URL
Set-Secret -SecretName "NEXT_PUBLIC_RFQ_ENDPOINT" -SecretValue $NEXT_PUBLIC_RFQ_ENDPOINT
Set-Secret -SecretName "NEXT_PUBLIC_RFQ_EMAIL" -SecretValue $NEXT_PUBLIC_RFQ_EMAIL
Set-Secret -SecretName "ASSET_BASE_URL" -SecretValue $ASSET_BASE_URL
Set-Secret -SecretName "NEXT_PUBLIC_ASSET_BASE_URL" -SecretValue $NEXT_PUBLIC_ASSET_BASE_URL
Set-Secret -SecretName "BAIDU_TONGJI_ID" -SecretValue $BAIDU_TONGJI_ID
Set-Secret -SecretName "NEXT_PUBLIC_BAIDU_TONGJI_ID" -SecretValue $NEXT_PUBLIC_BAIDU_TONGJI_ID
Set-Secret -SecretName "TENCENT_CAPTCHA_APP_ID" -SecretValue $TENCENT_CAPTCHA_APP_ID
Set-Secret -SecretName "NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID" -SecretValue $NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID
Write-Host ""

# Verify all secrets are set
Write-Host "✅ Verifying secrets..." -ForegroundColor Cyan
$REQUIRED_SECRETS = @(
    "ACR_USERNAME",
    "ACR_PASSWORD",
    "ACR_NAMESPACE",
    "ECS_HOST",
    "ECS_USERNAME",
    "ECS_PORT",
    "ECS_SSH_KEY",
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_RFQ_EMAIL"
)

$ALL_SET = $true
$secretsList = gh secret list 2>&1 | Out-String

foreach ($secret in $REQUIRED_SECRETS) {
    if ($secretsList -match $secret) {
        Write-Host "✓ $secret" -ForegroundColor Green
    } else {
        Write-Host "✗ $secret (missing)" -ForegroundColor Red
        $ALL_SET = $false
    }
}

Write-Host ""
if ($ALL_SET) {
    Write-Host "🎉 All required secrets configured successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Push your code to GitHub:"
    Write-Host "   git add ."
    Write-Host "   git commit -m 'Add GitHub Actions workflow'"
    Write-Host "   git push origin main"
    Write-Host ""
    Write-Host "2. The deployment will start automatically!"
    Write-Host "   View progress at: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    Write-Host ""
} else {
    Write-Host "⚠️  Some secrets are missing. Please configure them manually in GitHub Settings." -ForegroundColor Yellow
    Write-Host "   https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
}
