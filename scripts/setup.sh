#!/bin/bash

# Setup script for x402 Agent Service Marketplace

echo "🔧 Setting up x402 Agent Service Marketplace..."

# Check for Anchor
if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor not found. Installing..."
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    avm install latest
    avm use latest
fi

# Check for Solana CLI
if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Please install from https://docs.solana.com/cli/install-solana-cli-tools"
    exit 1
fi

# Set Solana to devnet
echo "🌐 Setting Solana to devnet..."
solana config set --url devnet

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

# Create .env file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env file..."
    cat > backend/.env << EOF
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=
EOF
    echo "⚠️  Please update backend/.env with your authority private key"
fi

echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Generate an authority keypair: solana-keygen new -o authority.json"
echo "2. Convert to JSON array and add to backend/.env as AUTHORITY_PRIVATE_KEY"
echo "3. Get devnet SOL: solana airdrop 2"
echo "4. Build and deploy: ./scripts/deploy.sh"
echo "5. Start backend: cd backend && npm run dev"
echo "6. Start frontend: cd frontend && npm run dev"

