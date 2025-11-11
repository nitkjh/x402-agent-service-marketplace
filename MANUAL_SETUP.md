# Manual Setup Instructions

Since some tools need manual installation on Windows, follow these steps:

## 1. Install Rust

1. Download from: https://rustup.rs/
2. Run the installer
3. **Restart PowerShell** after installation
4. Verify: `rustc --version`

## 2. Install Solana CLI

### Option A: Windows Native (Recommended)
1. Download from: https://github.com/solana-labs/solana/releases
2. Extract and add to PATH
3. Verify: `solana --version`

### Option B: Using WSL
1. Install WSL: `wsl --install`
2. In WSL: `sh -c "$(curl -sSfL https://release.solana.com/stable/install)"`
3. Add to PATH or use `wsl solana` commands

## 3. Install Anchor

After Rust is installed:
```powershell
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

Verify: `anchor --version`

## 4. Run Setup Script

Once all tools are installed:
```powershell
powershell -ExecutionPolicy Bypass -File setup-and-deploy.ps1
```

Or manually:

### 4a. Install Dependencies
```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 4b. Configure Solana
```powershell
solana config set --url devnet
solana airdrop 2
```

### 4c. Build and Deploy
```powershell
anchor build
anchor deploy --provider.cluster devnet
```

### 4d. Update Program ID

After first deployment, you'll get a program ID. Update it in:
1. `programs/x402-marketplace/src/lib.rs` - `declare_id!("YOUR_PROGRAM_ID");`
2. `Anchor.toml` - `[programs.devnet] x402_marketplace = "YOUR_PROGRAM_ID"`
3. `backend/src/solana/program.ts` - `const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID');`

Then rebuild and redeploy:
```powershell
anchor build
anchor deploy --provider.cluster devnet
```

### 4e. Copy IDL
```powershell
Copy-Item target\idl\x402_marketplace.json backend\src\idl\x402_marketplace.json
```

### 4f. Configure Backend

Create `backend/.env`:
```
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=[your keypair JSON array]
```

Generate authority keypair:
```powershell
solana-keygen new -o authority.json
node -e "const fs = require('fs'); const kp = JSON.parse(fs.readFileSync('authority.json')); console.log(JSON.stringify(Array.from(kp)));"
```

Copy the output to `.env` as `AUTHORITY_PRIVATE_KEY`.

## 5. Start Services

**Terminal 1:**
```powershell
cd backend
npm run dev
```

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

## 6. Test

1. Open http://localhost:3000
2. Register a service
3. Use a service
4. Verify payment flow

## Troubleshooting

### npm install permission errors
- Close all IDEs/editors
- Run PowerShell as Administrator
- Delete node_modules and try again

### Rust not found
- Restart PowerShell after installation
- Check PATH: `$env:PATH`

### Solana not found
- Add to PATH manually
- Or use full path to executable

### Anchor not found
- Ensure Rust is installed
- Run: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`

