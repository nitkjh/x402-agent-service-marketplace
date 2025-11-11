# Pre-Submission Checklist

Use this checklist before submitting your hackathon entry.

## 📋 Code Completeness

- [x] Solana program (Anchor/Rust) with service registry
- [x] Trust metrics on-chain storage
- [x] Backend API with 3 endpoints (register, list, use)
- [x] x402 payment integration
- [x] Frontend UI for browsing and using services
- [x] Test service example
- [x] Deployment scripts

## 📝 Documentation

- [x] README.md with full documentation
- [x] QUICKSTART.md for fast setup
- [x] DEPLOYMENT.md for deployment guide
- [x] HACKATHON_SUBMISSION.md with submission details
- [x] PROJECT_SUMMARY.md overview
- [x] LICENSE file (MIT)

## 🔧 Configuration

- [ ] Program deployed to devnet
- [ ] Program ID updated in all files:
  - [ ] `programs/x402-marketplace/src/lib.rs`
  - [ ] `Anchor.toml`
  - [ ] `backend/src/solana/program.ts`
- [ ] IDL copied to `backend/src/idl/x402_marketplace.json`
- [ ] Backend `.env` configured
- [ ] USDC mint address configured (devnet/mainnet)

## 🧪 Testing

- [ ] Program builds without errors: `anchor build`
- [ ] Program deploys successfully: `anchor deploy --provider.cluster devnet`
- [ ] Backend starts: `cd backend && npm run dev`
- [ ] Frontend starts: `cd frontend && npm run dev`
- [ ] Can register a service through UI
- [ ] Can list services
- [ ] Can use service with x402 payment
- [ ] Trust metrics update after service use

## 🎥 Demo Video

- [ ] Record 3-minute demo video
- [ ] Show service registration
- [ ] Show service usage
- [ ] Show payment transaction
- [ ] Show trust metric update
- [ ] Upload to YouTube/Vimeo
- [ ] Add link to HACKATHON_SUBMISSION.md

## 📦 Repository

- [ ] All code committed
- [ ] `.gitignore` configured
- [ ] No sensitive data (private keys) in repo
- [ ] README is clear and complete
- [ ] Repository is public (for open source requirement)

## 🔗 Links to Add

Update `HACKATHON_SUBMISSION.md` with:
- [ ] GitHub repository URL
- [ ] Demo video URL
- [ ] Live demo URL (if deployed)

## ⚠️ Known Issues to Note

- [ ] USDC mint address needs configuration
- [ ] Authority key for trust metrics (document in README)
- [ ] Test tokens needed for devnet (document in README)

## 🚀 Final Steps

1. **Test Everything**: Run through the full flow
2. **Record Demo**: Create 3-minute video
3. **Update Links**: Add all URLs to submission doc
4. **Final Review**: Check all checkboxes above
5. **Submit**: Follow hackathon submission process

## 📞 Support

If you encounter issues:
- Check [README.md](README.md) troubleshooting section
- Review [QUICKSTART.md](QUICKSTART.md) for setup
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues

---

**Good luck with your submission! 🎉**

