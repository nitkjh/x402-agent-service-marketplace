# Installation Requirements Checklist

Before running the project, ensure you have the following installed:

## ✅ Required Tools

- [ ] **Rust** - https://rustup.rs/
  - Verify: `rustc --version`
  - Verify: `cargo --version`

- [ ] **Solana CLI** - https://docs.solana.com/cli/install-solana-cli-tools
  - Verify: `solana --version`
  - Configure: `solana config set --url devnet`
  - Get SOL: `solana airdrop 2`

- [ ] **Anchor Framework** - https://www.anchor-lang.com/
  - Install: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force`
  - Install latest: `avm install latest && avm use latest`
  - Verify: `anchor --version`

- [ ] **Node.js 18+** - https://nodejs.org/
  - Verify: `node --version`
  - Verify: `npm --version`

## 📦 Project Dependencies

Once tools are installed, run:

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## 🚀 Quick Verification

Run these commands to verify everything is ready:

```powershell
# Check tools
rustc --version
cargo --version
solana --version
anchor --version
node --version

# Check Solana config
solana config get

# Check balance
solana balance
```

If any command fails, install the missing tool from the list above.

## 📝 What You Need From Me

I need you to:

1. **Install the required tools** (Rust, Solana CLI, Anchor, Node.js)
   - See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions

2. **Install project dependencies**:
   ```powershell
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Build and deploy the program**:
   ```powershell
   anchor build
   anchor deploy --provider.cluster devnet
   ```

4. **Update program ID** after first deployment (I'll guide you)

5. **Configure backend .env** with authority keypair

Once these are done, we can:
- Test the full flow
- Record the demo video
- Push to GitHub
- Submit to hackathon!

## ⚠️ Current Status

- ✅ All code is written and ready
- ✅ Project structure is complete
- ✅ Documentation is comprehensive
- ⏳ Waiting for tool installation
- ⏳ Waiting for dependencies installation
- ⏳ Waiting for program deployment

Let me know when you've installed the tools and we'll proceed with building and testing!

