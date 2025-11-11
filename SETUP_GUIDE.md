# Complete Setup Guide

## Prerequisites Installation

### 1. Install Rust
```powershell
# Download and install from https://rustup.rs/
# Or use winget:
winget install Rustlang.Rustup
```

### 2. Install Solana CLI
```powershell
# Download installer from https://docs.solana.com/cli/install-solana-cli-tools
# Or use PowerShell:
cmd /c "curl https://release.solana.com/stable/install | powershell"

# Add to PATH (usually C:\Users\YourName\.local\share\solana\install\active_release\bin)
# Verify installation:
solana --version
solana config set --url devnet
```

### 3. Install Anchor
```powershell
# Install avm (Anchor Version Manager)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Install latest Anchor
avm install latest
avm use latest

# Verify:
anchor --version
```

### 4. Install Node.js (if not already installed)
```powershell
# Download from https://nodejs.org/ (LTS version)
# Or use winget:
winget install OpenJS.NodeJS.LTS

# Verify:
node --version
npm --version
```

## Project Setup

### Step 1: Install Backend Dependencies

```powershell
cd backend

# If you get permission errors, try:
# Close any IDEs/editors that might have files open
# Run PowerShell as Administrator
npm install

# If still having issues, try:
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
npm install
```

### Step 2: Install Frontend Dependencies

```powershell
cd ../frontend
npm install
```

### Step 3: Build and Deploy Solana Program

```powershell
cd ..

# Ensure you're on devnet
solana config set --url devnet

# Get some devnet SOL
solana airdrop 2

# Build the program
anchor build

# Deploy (this will give you a program ID)
anchor deploy --provider.cluster devnet
```

**IMPORTANT**: After deployment, you'll get a program ID. Update it in:
1. `programs/x402-marketplace/src/lib.rs` - `declare_id!("YOUR_PROGRAM_ID");`
2. `Anchor.toml` - `[programs.devnet] x402_marketplace = "YOUR_PROGRAM_ID"`
3. `backend/src/solana/program.ts` - `const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID');`

Then rebuild and redeploy:
```powershell
anchor build
anchor deploy --provider.cluster devnet
```

### Step 4: Copy IDL

```powershell
Copy-Item target\idl\x402_marketplace.json backend\src\idl\x402_marketplace.json
```

### Step 5: Configure Backend

```powershell
cd backend

# Create .env file
@"
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=
"@ | Out-File -FilePath .env -Encoding utf8
```

Generate authority keypair:
```powershell
# Generate keypair
solana-keygen new -o authority.json

# Convert to JSON array format (run in Node.js)
node -e "const fs = require('fs'); const kp = JSON.parse(fs.readFileSync('authority.json')); console.log(JSON.stringify(Array.from(kp)));"

# Copy the output and paste into .env as AUTHORITY_PRIVATE_KEY
```

### Step 6: Start Services

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

**Terminal 3 - Test Service (Optional):**
```powershell
node examples/test-x402-service.js
```

## Testing

1. Open http://localhost:3000
2. Register a service:
   - Service ID: `test-service`
   - URL: `http://localhost:4021/test` (if using test service)
   - Price: `1000000` (1 USDC)
   - Generate owner keypair in UI
3. Use the service:
   - Click on service card
   - Generate client keypair
   - Click "Call Service"
   - Watch payment flow!

## Troubleshooting

### npm install permission errors
- Close all IDEs/editors
- Run PowerShell as Administrator
- Delete node_modules and try again

### Anchor not found
- Ensure Rust is installed
- Install avm: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
- Install Anchor: `avm install latest && avm use latest`
- Add to PATH if needed

### Solana not found
- Install Solana CLI
- Add to PATH: `C:\Users\YourName\.local\share\solana\install\active_release\bin`

### Program deployment fails
- Check you have SOL: `solana balance`
- Get more: `solana airdrop 2`
- Verify network: `solana config get`

## Next Steps

Once everything is set up:
1. Test the full flow
2. Record demo video
3. Push to GitHub
4. Submit to hackathon!

