# Complete setup and deployment script for x402 Marketplace
# Run this after installing Rust, Solana CLI, and Anchor

Write-Host "🚀 x402 Marketplace - Complete Setup" -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Green

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

$errors = @()

if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    $errors += "Node.js is not installed. Install from https://nodejs.org/"
}
if (!(Get-Command rustc -ErrorAction SilentlyContinue)) {
    $errors += "Rust is not installed. Install from https://rustup.rs/ (restart PowerShell after installation)"
}
if (!(Get-Command solana -ErrorAction SilentlyContinue)) {
    $errors += "Solana CLI is not installed. Install from https://docs.solana.com/cli/install-solana-cli-tools"
}
if (!(Get-Command anchor -ErrorAction SilentlyContinue)) {
    $errors += "Anchor is not installed. Run: cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && avm install latest && avm use latest"
}

if ($errors.Count -gt 0) {
    Write-Host "`n❌ Missing prerequisites:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
    Write-Host "`nPlease install missing tools and run this script again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ All prerequisites met!`n" -ForegroundColor Green

# Step 1: Install backend dependencies
Write-Host "Step 1: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
if (Test-Path node_modules) {
    Write-Host "Removing old node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Backend dependencies installation had issues. Continuing anyway..." -ForegroundColor Yellow
}
Set-Location ..

# Step 2: Install frontend dependencies
Write-Host "`nStep 2: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
if (Test-Path node_modules) {
    Write-Host "Removing old node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Frontend dependencies installation had issues. Continuing anyway..." -ForegroundColor Yellow
}
Set-Location ..

# Step 3: Configure Solana
Write-Host "`nStep 3: Configuring Solana..." -ForegroundColor Yellow
solana config set --url devnet
$balance = solana balance
Write-Host "Current balance: $balance" -ForegroundColor Cyan
if ($balance -match "0 SOL") {
    Write-Host "Requesting airdrop..." -ForegroundColor Yellow
    solana airdrop 2
}

# Step 4: Build Anchor program
Write-Host "`nStep 4: Building Anchor program..." -ForegroundColor Yellow
anchor build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

# Step 5: Deploy program
Write-Host "`nStep 5: Deploying to devnet..." -ForegroundColor Yellow
$deployOutput = anchor deploy --provider.cluster devnet 2>&1
Write-Host $deployOutput

# Extract program ID from output
$programId = $deployOutput | Select-String -Pattern "Program Id: (\w+)" | ForEach-Object { $_.Matches.Groups[1].Value }

if ($programId) {
    Write-Host "`n✅ Program deployed! Program ID: $programId" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: Update program ID in these files:" -ForegroundColor Yellow
    Write-Host "  1. programs/x402-marketplace/src/lib.rs" -ForegroundColor Cyan
    Write-Host "  2. Anchor.toml" -ForegroundColor Cyan
    Write-Host "  3. backend/src/solana/program.ts" -ForegroundColor Cyan
    Write-Host "`nThen run: anchor build && anchor deploy --provider.cluster devnet" -ForegroundColor Yellow
} else {
    Write-Host "⚠️  Could not extract program ID. Check deployment output above." -ForegroundColor Yellow
}

# Step 6: Copy IDL
Write-Host "`nStep 6: Copying IDL..." -ForegroundColor Yellow
if (Test-Path "target\idl\x402_marketplace.json") {
    Copy-Item "target\idl\x402_marketplace.json" "backend\src\idl\x402_marketplace.json" -Force
    Write-Host "✅ IDL copied" -ForegroundColor Green
} else {
    Write-Host "⚠️  IDL not found. Build may have failed." -ForegroundColor Yellow
}

Write-Host "`n✅ Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. Update program ID in the files listed above" -ForegroundColor Cyan
Write-Host "  2. Create backend/.env with AUTHORITY_PRIVATE_KEY" -ForegroundColor Cyan
Write-Host "  3. Run: cd backend; npm run dev" -ForegroundColor Cyan
Write-Host "  4. Run: cd frontend; npm run dev" -ForegroundColor Cyan

