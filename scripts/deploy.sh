#!/bin/bash

# Deploy script for x402 Agent Service Marketplace

echo "🚀 Building Anchor program..."
anchor build

if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "📦 Deploying to Solana devnet..."
anchor deploy --provider.cluster devnet

if [ $? -ne 0 ]; then
    echo "❌ Deployment failed!"
    exit 1
fi

echo "✅ Deployment successful!"
echo ""
echo "📝 Next steps:"
echo "1. Update PROGRAM_ID in backend/src/solana/program.ts with the deployed program ID"
echo "2. Copy target/idl/x402_marketplace.json to backend/src/idl/x402_marketplace.json"
echo "3. Update Anchor.toml with the new program ID if it changed"

