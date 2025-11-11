# Deployment Guide

## Quick Start

1. **Run setup script:**
   ```bash
   chmod +x scripts/setup.sh
   ./scripts/setup.sh
   ```

2. **Generate authority keypair:**
   ```bash
   solana-keygen new -o authority.json
   ```
   Convert the keypair to JSON array format:
   ```bash
   node -e "const fs = require('fs'); const keypair = JSON.parse(fs.readFileSync('authority.json')); console.log(JSON.stringify(Array.from(keypair)));"
   ```
   Copy the output to `backend/.env` as `AUTHORITY_PRIVATE_KEY`

3. **Get devnet SOL:**
   ```bash
   solana airdrop 2
   ```

4. **Deploy program:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

5. **Update program ID:**
   After deployment, copy the program ID from the output and update:
   - `programs/x402-marketplace/src/lib.rs` (declare_id!)
   - `Anchor.toml` (programs.devnet.x402_marketplace)
   - `backend/src/solana/program.ts` (PROGRAM_ID)

6. **Copy IDL:**
   ```bash
   cp target/idl/x402_marketplace.json backend/src/idl/x402_marketplace.json
   ```

7. **Start services:**
   ```bash
   # Terminal 1: Backend
   cd backend && npm run dev

   # Terminal 2: Frontend
   cd frontend && npm run dev
   ```

## Program ID Management

The program ID is declared in multiple places. After first deployment:

1. Update `programs/x402-marketplace/src/lib.rs`:
   ```rust
   declare_id!("YOUR_PROGRAM_ID_HERE");
   ```

2. Update `Anchor.toml`:
   ```toml
   [programs.devnet]
   x402_marketplace = "YOUR_PROGRAM_ID_HERE"
   ```

3. Update `backend/src/solana/program.ts`:
   ```typescript
   const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE');
   ```

4. Rebuild and redeploy:
   ```bash
   anchor build
   anchor deploy --provider.cluster devnet
   ```

## Environment Variables

### Backend (.env)
```
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=[...] # JSON array of authority keypair
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001
```

## Testing Deployment

1. **Check program is deployed:**
   ```bash
   solana program show YOUR_PROGRAM_ID --url devnet
   ```

2. **Test registration:**
   - Open frontend UI
   - Register a test service
   - Check transaction on Solscan

3. **Test service usage:**
   - Select a service
   - Generate client keypair
   - Call service
   - Verify payment and trust metrics update

## Troubleshooting

**Program ID mismatch:**
- Ensure all files have the same program ID
- Rebuild after updating program ID

**Deployment fails:**
- Check you have enough SOL: `solana balance`
- Verify network: `solana config get`
- Try airdrop: `solana airdrop 2`

**IDL not found:**
- Copy from `target/idl/` after building
- Ensure IDL matches deployed program

**Backend can't connect:**
- Verify RPC URL is correct
- Check network connectivity
- Try different RPC endpoint if needed

