# Script to push x402 Marketplace to GitHub
# Make sure you've created the repository on GitHub first!

param(
    [Parameter(Mandatory=$true)]
    [string]$GitHubUsername,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "x402-agent-service-marketplace"
)

Write-Host "🚀 Pushing x402 Marketplace to GitHub..." -ForegroundColor Green
Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "⚠️  Remote 'origin' already exists" -ForegroundColor Yellow
    $currentUrl = git remote get-url origin
    Write-Host "Current URL: $currentUrl" -ForegroundColor Cyan
    $change = Read-Host "Do you want to change it? (y/n)"
    if ($change -eq "y") {
        git remote remove origin
    } else {
        Write-Host "Using existing remote..." -ForegroundColor Yellow
        $repoUrl = $currentUrl
    }
} else {
    $repoUrl = "https://github.com/$GitHubUsername/$RepoName.git"
    Write-Host "Adding remote: $repoUrl" -ForegroundColor Cyan
    git remote add origin $repoUrl
}

# Check current branch
$currentBranch = git branch --show-current
Write-Host "Current branch: $currentBranch" -ForegroundColor Cyan

# Rename to main if needed
if ($currentBranch -ne "main") {
    Write-Host "Renaming branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
}

# Check if there are commits
$commitCount = (git log --oneline | Measure-Object -Line).Lines
if ($commitCount -eq 0) {
    Write-Host "❌ No commits found. Please commit your changes first." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Found $commitCount commit(s) ready to push" -ForegroundColor Green
Write-Host ""

# Show what will be pushed
Write-Host "Files that will be pushed:" -ForegroundColor Yellow
git ls-files | Measure-Object -Line | ForEach-Object { Write-Host "  $_ files" -ForegroundColor Cyan }

Write-Host ""
$confirm = Read-Host "Ready to push? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Push cancelled." -ForegroundColor Yellow
    exit 0
}

# Push to GitHub
Write-Host ""
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL: https://github.com/$GitHubUsername/$RepoName" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Verify repository is public" -ForegroundColor Cyan
    Write-Host "  2. Check all files are present" -ForegroundColor Cyan
    Write-Host "  3. Update HACKATHON_SUBMISSION.md with repository URL" -ForegroundColor Cyan
    Write-Host "  4. Record demo video" -ForegroundColor Cyan
    Write-Host "  5. Submit to hackathon!" -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Push failed. Common issues:" -ForegroundColor Red
    Write-Host "  - Repository doesn't exist on GitHub (create it first)" -ForegroundColor Yellow
    Write-Host "  - Authentication failed (use Personal Access Token)" -ForegroundColor Yellow
    Write-Host "  - No write access to repository" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "See PUSH_TO_GITHUB.md for detailed instructions." -ForegroundColor Cyan
}

