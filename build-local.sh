#!/bin/bash

###############################################################################
# Local Build Script for LUZA'S CULTURE
# This script builds the project locally before deployment
###############################################################################

set -e  # Exit on any error

echo "========================================="
echo "🏗️  LUZA'S CULTURE - Local Build"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"
CLIENT_DIR="$PROJECT_ROOT/loza-client-master/loza-client-master"
SERVER_DIR="$PROJECT_ROOT/loza-server-master/loza-server-master"

echo ""
print_info "Project root: $PROJECT_ROOT"
print_info "Client directory: $CLIENT_DIR"
print_info "Server directory: $SERVER_DIR"
echo ""

# Check if directories exist
if [ ! -d "$CLIENT_DIR" ]; then
    print_error "Client directory not found: $CLIENT_DIR"
    exit 1
fi

if [ ! -d "$SERVER_DIR" ]; then
    print_error "Server directory not found: $SERVER_DIR"
    exit 1
fi

# ==========================================
# Step 1: Install Client Dependencies
# ==========================================
echo "========================================="
echo "📦 Step 1: Installing Client Dependencies"
echo "========================================="
echo ""

cd "$CLIENT_DIR"

if [ ! -f "package.json" ]; then
    print_error "package.json not found in client directory"
    exit 1
fi

print_info "Installing client dependencies..."
if npm install; then
    print_success "Client dependencies installed successfully"
else
    print_error "Failed to install client dependencies"
    exit 1
fi

echo ""

# ==========================================
# Step 2: Build Client
# ==========================================
echo "========================================="
echo "🏗️  Step 2: Building Client (Next.js)"
echo "========================================="
echo ""

print_info "Building Next.js application..."
if npm run build; then
    print_success "Client built successfully"
else
    print_error "Client build failed"
    exit 1
fi

echo ""

# Verify build output
if [ ! -d ".next" ]; then
    print_error "Build output (.next) directory not found"
    exit 1
fi

print_success "Build output verified: .next directory exists"

echo ""

# ==========================================
# Step 3: Install Server Dependencies
# ==========================================
echo "========================================="
echo "📦 Step 3: Installing Server Dependencies"
echo "========================================="
echo ""

cd "$SERVER_DIR"

if [ ! -f "package.json" ]; then
    print_error "package.json not found in server directory"
    exit 1
fi

print_info "Installing server dependencies..."
if npm install; then
    print_success "Server dependencies installed successfully"
else
    print_error "Failed to install server dependencies"
    exit 1
fi

echo ""

# ==========================================
# Step 4: Verify Server Files
# ==========================================
echo "========================================="
echo "🔍 Step 4: Verifying Server Files"
echo "========================================="
echo ""

if [ ! -f "server.js" ]; then
    print_error "server.js not found"
    exit 1
fi

print_success "Server files verified"

# Check for important directories
if [ ! -d "controllers" ]; then
    print_error "controllers directory not found"
    exit 1
fi

if [ ! -d "models" ]; then
    print_error "models directory not found"
    exit 1
fi

if [ ! -d "routes" ]; then
    print_error "routes directory not found"
    exit 1
fi

if [ ! -d "services" ]; then
    print_error "services directory not found"
    exit 1
fi

print_success "Server structure verified"

echo ""

# ==========================================
# Step 5: Check Environment Files
# ==========================================
echo "========================================="
echo "📝 Step 5: Checking Environment Files"
echo "========================================="
echo ""

# Check server .env.example or create one
if [ -f ".env.example" ]; then
    print_success ".env.example found in server directory"
else
    print_info ".env.example not found - this is okay for production"
fi

# Check client .env.example
cd "$CLIENT_DIR"
if [ -f ".env.example" ]; then
    print_success ".env.example found in client directory"
else
    print_info ".env.example not found - this is okay for production"
fi

echo ""

# ==========================================
# Summary
# ==========================================
echo "========================================="
echo "✅ Build Summary"
echo "========================================="
echo ""
print_success "Local build completed successfully!"
echo ""
print_info "Build artifacts:"
echo "  - Client: $CLIENT_DIR/.next"
echo "  - Server: $SERVER_DIR (ready for deployment)"
echo ""
print_info "Next steps:"
echo "  1. Review deployment scripts"
echo "  2. Gather server credentials"
echo "  3. Run deployment script"
echo ""
echo "========================================="

