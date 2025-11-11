# Quick Start Guide

Get the x402 Agent Service Marketplace running in 5 minutes!

## Prerequisites Check

```bash
# Check Anchor
anchor --version  # Should be 0.30.1+

# Check Solana CLI
solana --version

# Check Node.js
node --version  # Should be 18+

# Set to devnet
solana config set --url devnet
```

## Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Step 2: Build & Deploy Program

```bash
# From project root
anchor build
anchor deploy --provider.cluster devnet
```

**Important:** After deployment, update the program ID in:
- `programs/x402-marketplace/src/lib.rs`
- `Anchor.toml`
- `backend/src/solana/program.ts`

Then copy the IDL:
```bash
cp target/idl/x402_marketplace.json backend/src/idl/x402_marketplace.json
```

## Step 3: Configure Backend

```bash
cd backend

# Create .env file
cat > .env << EOF
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=
EOF
```

Generate authority keypair:
```bash
solana-keygen new -o authority.json
node -e "const fs = require('fs'); const kp = JSON.parse(fs.readFileSync('authority.json')); console.log(JSON.stringify(Array.from(kp)));"
```

Copy the output to `.env` as `AUTHORITY_PRIVATE_KEY`.

## Step 4: Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Test Service (optional):**
```bash
node examples/test-x402-service.js
```

## Step 5: Test the Flow

1. **Open frontend:** http://localhost:3000

2. **Register a service:**
   - Service ID: `test-service`
   - URL: `http://localhost:4021/test` (if using test service)
   - Price: `1000000` (1 USDC)
   - Description: `Test API`
   - Generate owner keypair in frontend or use existing

3. **Use the service:**
   - Click on the service card
   - Generate client keypair
   - Click "Call Service"
   - Watch the payment flow!

## Troubleshooting

**"Program not found" error:**
- Make sure program is deployed: `solana program show YOUR_PROGRAM_ID --url devnet`
- Verify program ID matches in all files

**"Insufficient funds" error:**
- Get devnet SOL: `solana airdrop 2`
- Ensure wallet has USDC (for devnet, you may need test tokens)

**Backend won't start:**
- Check `.env` file exists and has correct values
- Verify Node modules installed: `npm install`

**x402 payment fails:**
- Ensure service URL supports x402 (returns 402 status)
- Check USDC mint address is correct for your network
- Verify client wallet has sufficient USDC balance

## Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Explore the code to customize for your needs

Happy building! 🚀

