# PowerShell Local Build Script for LUZA'S CULTURE
# This script builds the project locally before deployment

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🏗️  LUZA'S CULTURE - Local Build" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Success {
    Write-Host "✅ $args" -ForegroundColor Green
}

function Write-Error-Custom {
    Write-Host "❌ $args" -ForegroundColor Red
}

function Write-Info {
    Write-Host "ℹ️  $args" -ForegroundColor Yellow
}

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Success "Node.js version: $nodeVersion"
} catch {
    Write-Error-Custom "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
}

# Check Node.js version
$nodeMajorVersion = (node -v).Replace('v', '').Split('.')[0]
if ([int]$nodeMajorVersion -lt 18) {
    Write-Error-Custom "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm -v
    Write-Success "npm version: $npmVersion"
} catch {
    Write-Error-Custom "npm is not installed. Please install npm first."
    exit 1
}

# Get script directory
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$PROJECT_ROOT = $SCRIPT_DIR
$CLIENT_DIR = Join-Path $PROJECT_ROOT "loza-client-master\loza-client-master"
$SERVER_DIR = Join-Path $PROJECT_ROOT "loza-server-master\loza-server-master"

Write-Host ""
Write-Info "Project root: $PROJECT_ROOT"
Write-Info "Client directory: $CLIENT_DIR"
Write-Info "Server directory: $SERVER_DIR"
Write-Host ""

# Check if directories exist
if (-not (Test-Path $CLIENT_DIR)) {
    Write-Error-Custom "Client directory not found: $CLIENT_DIR"
    exit 1
}

if (-not (Test-Path $SERVER_DIR)) {
    Write-Error-Custom "Server directory not found: $SERVER_DIR"
    exit 1
}

# ==========================================
# Step 1: Install Client Dependencies
# ==========================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📦 Step 1: Installing Client Dependencies" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $CLIENT_DIR

if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found in client directory"
    exit 1
}

Write-Info "Installing client dependencies..."
try {
    npm install
    Write-Success "Client dependencies installed successfully"
} catch {
    Write-Error-Custom "Failed to install client dependencies"
    exit 1
}

Write-Host ""

# ==========================================
# Step 2: Build Client
# ==========================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🏗️  Step 2: Building Client (Next.js)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Info "Building Next.js application..."
try {
    npm run build
    Write-Success "Client built successfully"
} catch {
    Write-Error-Custom "Client build failed"
    exit 1
}

Write-Host ""

# Verify build output
if (-not (Test-Path ".next")) {
    Write-Error-Custom "Build output (.next) directory not found"
    exit 1
}

Write-Success "Build output verified: .next directory exists"

Write-Host ""

# ==========================================
# Step 3: Install Server Dependencies
# ==========================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📦 Step 3: Installing Server Dependencies" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Set-Location $SERVER_DIR

if (-not (Test-Path "package.json")) {
    Write-Error-Custom "package.json not found in server directory"
    exit 1
}

Write-Info "Installing server dependencies..."
try {
    npm install
    Write-Success "Server dependencies installed successfully"
} catch {
    Write-Error-Custom "Failed to install server dependencies"
    exit 1
}

Write-Host ""

# ==========================================
# Step 4: Verify Server Files
# ==========================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🔍 Step 4: Verifying Server Files" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "server.js")) {
    Write-Error-Custom "server.js not found"
    exit 1
}

Write-Success "Server files verified"

# Check for important directories
$requiredDirs = @("controllers", "models", "routes", "services")
foreach ($dir in $requiredDirs) {
    if (-not (Test-Path $dir)) {
        Write-Error-Custom "$dir directory not found"
        exit 1
    }
}

Write-Success "Server structure verified"

Write-Host ""

# ==========================================
# Summary
# ==========================================
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✅ Build Summary" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Success "Local build completed successfully!"
Write-Host ""
Write-Info "Build artifacts:"
Write-Host "  - Client: $CLIENT_DIR\.next"
Write-Host "  - Server: $SERVER_DIR (ready for deployment)"
Write-Host ""
Write-Info "Next steps:"
Write-Host "  1. Review deployment scripts"
Write-Host "  2. Gather server credentials"
Write-Host "  3. Run deployment script"
Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan

