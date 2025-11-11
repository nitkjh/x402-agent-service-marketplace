# x402 Agent Service Marketplace & Router

An open-source Agent Service Marketplace built on Solana devnet with x402 HTTP-native payment integration. This project enables service providers to register paid API endpoints and allows agents/clients to discover and use these services with automatic micropayments.

## 🚀 Features

- **On-Chain Service Registry**: Register service endpoints on Solana with metadata (URL, price, description)
- **Trust Metrics**: Track success/failure counts for each service on-chain
- **x402 Payment Integration**: Automatic payment handling using HTTP 402 Payment Required protocol
- **Service Proxy**: Backend routes requests through x402 payment flow
- **Web UI**: Simple frontend to browse, register, and use services
- **Solana Devnet**: Fully deployed and tested on Solana devnet

## 📋 Requirements

- Node.js 18+
- Rust & Anchor (v0.30.1)
- Solana CLI tools
- A Solana wallet with devnet SOL

## 🏗️ Project Structure

```
.
├── programs/
│   └── x402-marketplace/     # Anchor program (Rust)
├── backend/                   # Express.js API server
│   ├── src/
│   │   ├── routes/           # API endpoints
│   │   ├── solana/           # Solana program client
│   │   └── index.ts          # Server entry point
├── frontend/                  # React + Vite frontend
│   └── src/
│       └── App.tsx            # Main UI component
├── Anchor.toml                # Anchor configuration
└── README.md
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
# Install Anchor (if not already installed)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest

# Install Solana CLI (if not already installed)
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Node dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Build and Deploy Solana Program

```bash
# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Update the program ID in Anchor.toml if it changed
# Copy the new program ID to backend/src/solana/program.ts
```

### 3. Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```
PORT=3001
SOLANA_RPC_URL=https://api.devnet.solana.com
AUTHORITY_PRIVATE_KEY=[...] # JSON array of authority keypair bytes
```

Generate an authority keypair:
```bash
solana-keygen new -o authority.json
# Convert to JSON array format for .env
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:3001`

### 5. Start Frontend

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### Register Service
```bash
POST /api/register
Content-Type: application/json

{
  "serviceId": "my-service",
  "url": "https://api.example.com/endpoint",
  "priceUSDC": 1000000,  # 1 USDC (6 decimals)
  "description": "My awesome API service",
  "ownerPrivateKey": "[...]"  # JSON array
}
```

### List Services
```bash
GET /api/list
```

Returns all registered services with trust metrics.

### Use Service
```bash
POST /api/use
Content-Type: application/json

{
  "serviceId": "my-service",
  "requestData": {
    "method": "GET",
    "headers": {},
    "body": {}
  },
  "clientPrivateKey": "[...]"  # JSON array
}
```

## 🔄 x402 Payment Flow

1. **Client Request**: Client selects a service and makes a request
2. **402 Response**: Service returns HTTP 402 Payment Required
3. **Payment Creation**: x402 wrapper creates Solana payment transaction
4. **Payment Execution**: Client signs and submits payment (USDC)
5. **Retry with Payment**: Request retried with `X-PAYMENT` header
6. **Service Response**: Service validates payment and returns data
7. **Trust Update**: Backend updates on-chain trust metrics

## 🎯 Usage Example

### 1. Register a Service

1. Open the frontend UI
2. Fill in the registration form:
   - Service ID: `test-api`
   - URL: `https://your-x402-api.com/endpoint`
   - Price: `1000000` (1 USDC)
   - Description: `Test API service`
   - Owner Private Key: Paste your wallet's private key (JSON array)
3. Click "Register Service"
4. Wait for transaction confirmation

### 2. Use a Service

1. Click on a service card to select it
2. Generate or paste a client private key
3. Click "Call Service (x402 Payment)"
4. The system will:
   - Forward request to service URL
   - Handle 402 payment flow automatically
   - Display payment transaction
   - Show service response
   - Update trust metrics

## 🧪 Testing

### Test with a Mock x402 Service

You can create a simple Express server that returns 402:

```javascript
const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  if (!req.headers['x-payment']) {
    return res.status(402).json({ 
      error: 'Payment required',
      price: '$0.0001'
    });
  }
  res.json({ data: 'Success! Payment verified.' });
});

app.listen(4021);
```

Register this as a service and test the full flow.

## 🔐 Security Notes

- **Private Keys**: Never commit private keys to version control
- **Authority Key**: The authority key should be kept secure as it can update trust metrics
- **Production**: For production, implement proper authentication and authorization
- **USDC Mint**: Update the USDC mint address for your network (devnet/mainnet)

## 📝 Program Instructions

### `register_service`
Registers a new service endpoint on-chain.

**Accounts:**
- `service`: PDA derived from service ID
- `owner`: Service owner (signer)
- `system_program`: Solana System Program

**Args:**
- `service_id`: Unique service identifier
- `url`: Service endpoint URL
- `price_usdc`: Price in USDC (6 decimals)
- `description`: Service description

### `update_trust_metrics`
Updates success/failure counts for a service.

**Accounts:**
- `service`: Service account (mutable)
- `authority`: Authority that can update metrics (signer)

**Args:**
- `success`: Boolean indicating if service call succeeded

## 🎥 Demo Video Flow

1. **Register Endpoint** (30s)
   - Show registration form
   - Submit transaction
   - Show transaction confirmation

2. **Agent Uses Service** (60s)
   - Browse available services
   - Select a service
   - Generate client keypair
   - Initiate service call

3. **Payment Runs** (60s)
   - Show 402 response handling
   - Display payment transaction
   - Show payment confirmation on Solscan

4. **Trust Metric Updates** (30s)
   - Show updated success count
   - Verify on-chain update
   - Show transaction hash

## 🤝 Contributing

This is an open-source hackathon project. Contributions welcome!

## 📄 License

MIT License - See LICENSE file

## 🔗 Resources

- [x402 Documentation](https://solana.com/x402/what-is-x402)
- [Corbits Quickstart](https://docs.corbits.dev/quickstart)
- [x402 Integration Guide](https://solana.com/developers/guides/getstarted/build-a-x402-facilitator)
- [Solana Documentation](https://docs.solana.com/)

## ⚠️ Known Limitations

- MVP implementation - not production-ready
- Trust metrics can be updated by any authority (should be restricted in production)
- USDC mint address needs to be configured for your network
  - Devnet: Use a test token mint or configure your own
  - Mainnet: Use official USDC mint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
- No authentication/authorization on API endpoints (add for production)

## 🧪 Test Service

A simple test x402 service is included in `examples/test-x402-service.js`:

```bash
node examples/test-x402-service.js
```

Register `http://localhost:4021/test` as a service to test the full payment flow.

## 🐛 Troubleshooting

**Program deployment fails:**
- Ensure you have devnet SOL: `solana airdrop 2`
- Check Anchor version: `anchor --version`
- Verify program ID matches in all files

**Backend errors:**
- Check `.env` file is configured
- Verify Solana RPC URL is accessible
- Ensure authority keypair is valid

**x402 payment fails:**
- Verify service URL supports x402
- Check client wallet has USDC
- Ensure USDC mint address is correct for network

---

Built for Solana x402 Hackathon 🚀

