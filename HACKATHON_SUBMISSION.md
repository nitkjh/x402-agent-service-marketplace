# x402 Agent Service Marketplace & Router - Hackathon Submission

## 🎯 Project Overview

An open-source Agent Service Marketplace built on Solana devnet that enables service providers to register paid API endpoints and allows AI agents/clients to discover and use these services with automatic x402 HTTP-native micropayments.

## ✅ Hackathon Requirements Checklist

- [x] **Open Source Repository**: All code is open-source (MIT License)
- [x] **x402 Integration**: Full x402 protocol implementation with automatic payment handling
- [x] **Solana Devnet Deployment**: Complete Anchor program deployed on devnet
- [x] **Demo Video Ready**: Simple 3-minute flow documented

## 🏗️ Architecture

### On-Chain Components (Solana Program)
- **Service Registry**: PDA-based storage for service endpoints
- **Trust Metrics**: On-chain success/failure tracking
- **Instructions**:
  - `register_service`: Register new service endpoints
  - `update_trust_metrics`: Update service reliability metrics

### Backend (Node.js/Express)
- **RegisterEndpoint API**: Register services on-chain
- **ListEndpoints API**: Query all registered services with metrics
- **UseService Proxy**: Handles x402 payment flow and proxies requests

### Frontend (React/Vite)
- Service browser with trust metrics
- Service registration form
- Service usage with automatic x402 payment

## 🔄 x402 Payment Flow

1. Client selects service and initiates request
2. Backend forwards request to service URL
3. Service returns HTTP 402 Payment Required
4. x402 wrapper creates Solana payment transaction
5. Client signs and submits USDC payment
6. Request retried with `X-PAYMENT` header
7. Service validates and returns data
8. Backend updates on-chain trust metrics

## 📊 Key Features

- ✅ On-chain service registry with metadata
- ✅ Trust metrics (success/failure counts)
- ✅ Automatic x402 payment handling
- ✅ Service discovery and browsing
- ✅ Real-time trust metric updates
- ✅ Transaction tracking and verification

## 🚀 Demo Video Script (3 minutes)

### 0:00 - 0:30: Register Endpoint
- Show frontend UI
- Fill registration form
- Submit transaction
- Show Solscan transaction link
- Verify service appears in list

### 0:30 - 1:30: Agent Uses Service
- Browse available services
- Show trust metrics
- Select a service
- Generate client keypair
- Initiate service call

### 1:30 - 2:30: Payment Runs
- Show 402 response handling
- Display payment transaction creation
- Show transaction signature
- Open Solscan to verify payment
- Show successful service response

### 2:30 - 3:00: Trust Metric Updates
- Show updated success count
- Refresh service list
- Verify on-chain update
- Show transaction hash
- Highlight trust score improvement

## 📁 Project Structure

```
x402-marketplace/
├── programs/x402-marketplace/    # Anchor program
├── backend/                       # Express API
├── frontend/                      # React UI
├── examples/                      # Test service
├── scripts/                       # Deployment scripts
└── docs/                          # Documentation
```

## 🛠️ Tech Stack

- **Blockchain**: Solana (devnet)
- **Program**: Anchor (Rust)
- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React, Vite, TypeScript
- **Payments**: x402 protocol, @faremeter packages
- **Web3**: @solana/web3.js, @coral-xyz/anchor

## 📝 Setup Instructions

See [QUICKSTART.md](QUICKSTART.md) for 5-minute setup guide.

## 🎥 Demo Highlights

1. **Registration**: On-chain service registration with metadata
2. **Discovery**: Browse services with real-time trust metrics
3. **Payment**: Automatic x402 micropayment handling
4. **Trust**: On-chain trust metric updates after each use

## 🔗 Resources

- [x402 Documentation](https://solana.com/x402/what-is-x402)
- [Corbits Quickstart](https://docs.corbits.dev/quickstart)
- [Solana x402 Guide](https://solana.com/developers/guides/getstarted/build-a-x402-facilitator)

## 📄 License

MIT License - Open source and free to use

## 👥 Team

Built for Solana x402 Hackathon

---

**Repository**: [GitHub URL]
**Demo Video**: [Video URL]
**Live Demo**: [Deployment URL]

