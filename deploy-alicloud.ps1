# Alibaba Cloud Quick Deployment Script (PowerShell)
# Estimated Time: 5-10 minutes

param(
    [string]$ACRUsername = "",
    [string]$ACRNamespace = "your-namespace",
    [string]$ECSHost = "",
    [string]$ECSUser = "root"
)

$ACRRegistry = "registry.cn-hangzhou.aliyuncs.com"
$ImageName = "garment-site"
$ImageTag = "latest"

Write-Host "🚀 Starting Alibaba Cloud Deployment..." -ForegroundColor Green
Write-Host ""

# Step 1: Build the image
Write-Host "📦 Building Docker image..." -ForegroundColor Cyan
docker build -t "${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}" .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Step 2: Login to ACR
Write-Host "🔐 Logging in to Alibaba Cloud Container Registry..." -ForegroundColor Cyan
if ($ACRUsername -eq "") {
    $ACRUsername = Read-Host "Enter your Alibaba Cloud ACR username"
}
$ACRPassword = Read-Host "Enter your Alibaba Cloud ACR password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ACRPassword)
$PlainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

echo $PlainPassword | docker login --username=$ACRUsername --password-stdin $ACRRegistry
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Login failed!" -ForegroundColor Red
    exit 1
}

# Step 3: Push to ACR
Write-Host "📤 Pushing image to ACR..." -ForegroundColor Cyan
docker push "${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}"
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed!" -ForegroundColor Red
    exit 1
}

# Step 4: Deploy to ECS (if host is provided)
if ($ECSHost -ne "") {
    Write-Host "🖥️  Deploying to ECS instance at $ECSHost..." -ForegroundColor Cyan
    
    # Create deployment script for remote execution
    $RemoteScript = @"
docker pull ${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}
docker stop garment-site 2>`$null
docker rm garment-site 2>`$null
docker run -d `
  --name garment-site `
  --restart unless-stopped `
  -p 80:80 `
  ${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}
Write-Host "✅ Deployment complete!"
docker ps --filter "name=garment-site"
"@
    
    # Execute on remote ECS
    ssh "${ECSUser}@${ECSHost}" $RemoteScript
    
    Write-Host ""
    Write-Host "🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "Website will be available at: http://${ECSHost}" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ Image pushed to ACR successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Alibaba Cloud Console → Container Service"
    Write-Host "2. Create application using image: ${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}"
    Write-Host "3. Or deploy to ECS manually:"
    Write-Host "   docker run -d --name garment-site -p 80:80 ${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}"
}

Write-Host ""
Write-Host "📊 Deployment Summary:" -ForegroundColor Green
Write-Host "  - Image: ${ACRRegistry}/${ACRNamespace}/${ImageName}:${ImageTag}"
Write-Host "  - Tag: ${ImageTag}"
Write-Host "  - Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
