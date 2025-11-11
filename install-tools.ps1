# Installation script for x402 Marketplace development tools

Write-Host "🚀 Installing development tools for x402 Marketplace..." -ForegroundColor Green

# Check Node.js
Write-Host "`n✅ Node.js: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm: $(npm --version)" -ForegroundColor Green

# Install Rust
Write-Host "`n📦 Installing Rust..." -ForegroundColor Yellow
if (!(Get-Command rustc -ErrorAction SilentlyContinue)) {
    Write-Host "Downloading Rust installer..." -ForegroundColor Yellow
    $rustupUrl = "https://win.rustup.rs/x86_64"
    $rustupPath = "$env:TEMP\rustup-init.exe"
    
    try {
        Invoke-WebRequest -Uri $rustupUrl -OutFile $rustupPath
        Write-Host "Rust installer downloaded. Please run it manually:" -ForegroundColor Yellow
        Write-Host "  $rustupPath" -ForegroundColor Cyan
        Write-Host "`nOr install from: https://rustup.rs/" -ForegroundColor Yellow
        Write-Host "After installation, restart PowerShell and run this script again." -ForegroundColor Yellow
        exit 1
    } catch {
        Write-Host "Failed to download Rust installer. Please install manually from https://rustup.rs/" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Rust is already installed: $(rustc --version)" -ForegroundColor Green
}

# Install Solana CLI
Write-Host "`n📦 Installing Solana CLI..." -ForegroundColor Yellow
if (!(Get-Command solana -ErrorAction SilentlyContinue)) {
    Write-Host "Downloading Solana installer..." -ForegroundColor Yellow
    $solanaInstallScript = "https://release.solana.com/stable/install"
    
    try {
        $installScript = Invoke-WebRequest -Uri $solanaInstallScript -UseBasicParsing
        $scriptContent = $installScript.Content
        
        # Create a temporary script file
        $tempScript = "$env:TEMP\solana-install.sh"
        $scriptContent | Out-File -FilePath $tempScript -Encoding UTF8
        
        Write-Host "Solana installer script downloaded." -ForegroundColor Yellow
        Write-Host "For Windows, please install Solana CLI manually:" -ForegroundColor Yellow
        Write-Host "  1. Download from: https://github.com/solana-labs/solana/releases" -ForegroundColor Cyan
        Write-Host "  2. Or use WSL: wsl --install" -ForegroundColor Cyan
        Write-Host "  3. Then in WSL: sh -c `"`$(curl -sSfL https://release.solana.com/stable/install)`"" -ForegroundColor Cyan
    } catch {
        Write-Host "Failed to download Solana installer. Please install manually." -ForegroundColor Red
        Write-Host "See: https://docs.solana.com/cli/install-solana-cli-tools" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Solana CLI is already installed: $(solana --version)" -ForegroundColor Green
}

# Install Anchor (requires Rust)
Write-Host "`n📦 Installing Anchor..." -ForegroundColor Yellow
if (Get-Command cargo -ErrorAction SilentlyContinue) {
    if (!(Get-Command anchor -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Anchor Version Manager (avm)..." -ForegroundColor Yellow
        cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Installing latest Anchor..." -ForegroundColor Yellow
            avm install latest
            avm use latest
            Write-Host "✅ Anchor installed: $(anchor --version)" -ForegroundColor Green
        } else {
            Write-Host "Failed to install Anchor. Please install manually." -ForegroundColor Red
        }
    } else {
        Write-Host "✅ Anchor is already installed: $(anchor --version)" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Rust/Cargo not found. Install Rust first, then run:" -ForegroundColor Yellow
    Write-Host "   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force" -ForegroundColor Cyan
    Write-Host "   avm install latest" -ForegroundColor Cyan
    Write-Host "   avm use latest" -ForegroundColor Cyan
}

Write-Host "`n✅ Installation check complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "  1. If Rust was just installed, restart PowerShell" -ForegroundColor Cyan
Write-Host "  2. Run: cd backend; npm install" -ForegroundColor Cyan
Write-Host "  3. Run: cd ../frontend; npm install" -ForegroundColor Cyan
Write-Host "  4. Run: anchor build" -ForegroundColor Cyan

