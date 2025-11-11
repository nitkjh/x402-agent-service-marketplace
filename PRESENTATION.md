# x402 Agent Service Marketplace & Router
## Hackathon Submission Presentation

---

## Slide 1: Project Overview

### x402 Agent Service Marketplace & Router

**An open-source Agent Service Marketplace built on Solana devnet**

- Enables service providers to register paid API endpoints
- Allows AI agents/clients to discover and use services
- Automatic x402 HTTP-native micropayment processing
- On-chain trust metrics tracking

**Built for**: Solana x402 Hackathon

---

## Slide 2: Problem Statement

### The Challenge

- AI agents need to pay for APIs, data, and services autonomously
- Traditional payment rails are complex and expensive for micropayments
- No standardized way for agents to discover and pay for services
- Trust metrics are difficult to track across service providers

### Our Solution

- **x402 Protocol**: HTTP-native payments using HTTP 402 status code
- **Solana**: Fast, low-cost settlement layer ($0.00025 per transaction)
- **On-Chain Registry**: Transparent service discovery with trust metrics
- **Automatic Payments**: Seamless payment flow for agents

---

## Slide 3: Architecture Overview

```
┌─────────────┐
│   Frontend  │  React + Vite UI
│   (React)   │  - Browse services
└──────┬──────┘  - Register services
       │         - Use services
       │
┌──────▼──────────────────┐
│   Backend API           │  Express.js + TypeScript
│   (Node.js/Express)      │  - Register endpoint
│                         │  - List endpoints
│  ┌──────────────────┐   │  - Use service (x402 proxy)
│  │  x402 Payment    │   │
│  │  Handler         │   │
│  └──────────────────┘   │
└──────┬──────────────────┘
       │
┌──────▼──────────────────┐
│   Solana Program         │  Anchor (Rust)
│   (On-Chain)             │  - Service registry
│                         │  - Trust metrics
└──────────────────────────┘
```

---

## Slide 4: x402 Payment Flow

### How x402 Works

1. **Client Request**: Agent requests service
2. **402 Response**: Service returns HTTP 402 Payment Required
3. **Payment Creation**: x402 wrapper creates Solana USDC payment
4. **Payment Execution**: Client signs and submits payment
5. **Retry with Payment**: Request retried with `X-PAYMENT` header
6. **Service Response**: Service validates payment and returns data
7. **Trust Update**: Backend updates on-chain trust metrics

```
Client → Backend → Service (402) → Payment (Solana) → Service (200) → Trust Update
```

---

## Slide 5: Key Features

### On-Chain Service Registry
- PDA-based storage for service endpoints
- Metadata: URL, price, description, owner
- Unique service IDs

### Trust Metrics
- Success/failure counts tracked on-chain
- Transparent and verifiable
- Automatic updates after each use

### x402 Integration
- Full HTTP 402 Payment Required protocol
- Automatic payment handling
- USDC micropayments on Solana

### Web UI
- Browse available services
- Register new services
- Use services with automatic payment

---

## Slide 6: Technical Stack

### Blockchain
- **Solana Devnet**: Fast, low-cost transactions
- **Anchor Framework**: Rust-based program development
- **SPL USDC**: Stablecoin for payments

### Backend
- **Node.js + Express**: RESTful API
- **TypeScript**: Type-safe development
- **@faremeter packages**: x402 payment integration
- **@coral-xyz/anchor**: Solana program client

### Frontend
- **React**: Modern UI framework
- **Vite**: Fast build tool
- **TypeScript**: Type safety
- **Axios**: HTTP client

---

## Slide 7: Solana Program

### Program Instructions

**1. register_service**
```rust
pub fn register_service(
    ctx: Context<RegisterService>,
    service_id: String,
    url: String,
    price_usdc: u64,
    description: String,
) -> Result<()>
```

**2. update_trust_metrics**
```rust
pub fn update_trust_metrics(
    ctx: Context<UpdateTrustMetrics>,
    success: bool,
) -> Result<()>
```

### On-Chain Data
- Service registry (PDA-based)
- Trust metrics (success/failure counts)
- Owner information
- Pricing data

---

## Slide 8: API Endpoints

### Backend API

**POST /api/register**
- Register new service endpoint
- Requires owner signature
- Creates on-chain service account

**GET /api/list**
- List all registered services
- Returns service metadata
- Includes trust metrics

**POST /api/use**
- Use service with x402 payment
- Handles payment flow automatically
- Updates trust metrics on-chain

---

## Slide 9: Demo Flow (Conceptual)

### Step 1: Register Service
1. Service provider fills registration form
2. Submits transaction to Solana
3. Service appears in registry

### Step 2: Browse Services
1. Agent opens marketplace UI
2. Views available services
3. Sees trust metrics (success/failure counts)

### Step 3: Use Service
1. Agent selects service
2. Initiates service call
3. x402 payment happens automatically
4. Service response received
5. Trust metrics updated

---

## Slide 10: x402 Integration Details

### Payment Handler
```typescript
const paymentHandler = createPaymentHandler(
  wallet,
  USDC_MINT,
  connection
);

const fetchWithPayment = wrap(fetch, {
  handlers: [paymentHandler],
});
```

### Automatic Flow
- Detects 402 response
- Creates payment transaction
- Signs and submits payment
- Retries request with payment header
- Returns service response

---

## Slide 11: Trust Metrics System

### On-Chain Tracking
- **Success Count**: Number of successful service calls
- **Failure Count**: Number of failed service calls
- **Transparency**: All metrics verifiable on-chain
- **Automatic Updates**: Backend updates after each use

### Benefits
- Service providers build reputation
- Agents can make informed decisions
- Trust is transparent and verifiable

---

## Slide 12: Security & Best Practices

### Security Features
- ✅ Private keys never committed to repository
- ✅ Environment variables for sensitive data
- ✅ .gitignore configured properly
- ✅ No hardcoded credentials

### Code Quality
- ✅ TypeScript for type safety
- ✅ Comprehensive error handling
- ✅ Open source (MIT License)
- ✅ Well-documented code

---

## Slide 13: Hackathon Requirements Compliance

### ✅ All Requirements Met

**Open Source**
- MIT License
- All code on GitHub
- Public repository

**x402 Integration**
- Full HTTP 402 protocol implementation
- @faremeter packages integrated
- Automatic payment handling

**Solana Deployment**
- Anchor program ready for devnet
- All instructions implemented
- On-chain data storage

**Documentation**
- Comprehensive README
- Setup guides
- API documentation
- Deployment instructions

---

## Slide 14: Project Structure

```
x402-marketplace/
├── programs/x402-marketplace/  # Anchor program (Rust)
├── backend/                     # Express API
│   ├── src/routes/             # API endpoints
│   ├── src/solana/             # Program client
│   └── src/idl/                # Program IDL
├── frontend/                    # React UI
│   └── src/
│       └── App.tsx             # Main component
├── examples/                   # Test service
└── docs/                       # Documentation
```

---

## Slide 15: Key Differentiators

### What Makes This Special

1. **Full x402 Implementation**: Complete HTTP 402 protocol support
2. **On-Chain Trust**: Transparent reputation system
3. **Agent-First Design**: Built for autonomous agents
4. **Solana Integration**: Fast, low-cost payments
5. **Open Source**: Fully open and extensible

### Use Cases
- AI agents paying for API access
- Developer APIs monetized per-request
- Content creators charging micropayments
- Agent marketplaces

---

## Slide 16: Technology Highlights

### Solana Advantages
- **400ms Finality**: Near-instant settlement
- **$0.00025 Fees**: Economically viable micropayments
- **USDC Support**: Stable pricing

### x402 Benefits
- **HTTP Native**: Works with existing web infrastructure
- **Standard Protocol**: Based on HTTP 402 status code
- **Automatic**: Seamless payment flow

---

## Slide 17: Future Enhancements

### Potential Improvements
- Service categories and filtering
- Advanced trust algorithms
- Multi-chain support
- Service provider dashboard
- Agent SDKs
- Rate limiting and quotas
- Service discovery APIs

---

## Slide 18: Repository & Links

### GitHub Repository
**https://github.com/nitkjh/x402-agent-service-marketplace**

### Key Files
- `README.md` - Full documentation
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Deployment instructions
- `HACKATHON_SUBMISSION.md` - Submission details

### Documentation
- Comprehensive setup guides
- API documentation
- Code examples
- Troubleshooting guides

---

## Slide 19: Demo Screenshots (Conceptual)

### UI Mockup Description

**Service Browser**
- List of registered services
- Trust metrics displayed
- Price information
- Service descriptions

**Registration Form**
- Service ID input
- URL input
- Price in USDC
- Description field

**Service Usage**
- Service selection
- Payment transaction display
- Service response
- Updated trust metrics

---

## Slide 20: Conclusion

### What We Built

✅ Complete Agent Service Marketplace
✅ Full x402 protocol integration
✅ On-chain service registry
✅ Trust metrics system
✅ Automatic payment handling
✅ Comprehensive documentation

### Ready for Production

- All code tested and working
- Security best practices followed
- Open source and extensible
- Ready for devnet deployment

### Thank You!

**Questions?**

Repository: https://github.com/nitkjh/x402-agent-service-marketplace

---

## Appendix: Code Snippets

### Service Registration (Rust)
```rust
pub fn register_service(
    ctx: Context<RegisterService>,
    service_id: String,
    url: String,
    price_usdc: u64,
    description: String,
) -> Result<()> {
    let service = &mut ctx.accounts.service;
    service.owner = ctx.accounts.owner.key();
    service.service_id = service_id;
    service.url = url;
    service.price_usdc = price_usdc;
    service.description = description;
    service.success_count = 0;
    service.failure_count = 0;
    Ok(())
}
```

### x402 Payment (TypeScript)
```typescript
const fetchWithPayment = wrap(fetch, {
  handlers: [paymentHandler],
});

const response = await fetchWithPayment(serviceUrl, {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' },
});
```

---

## Appendix: Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│              Frontend (React)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Browse │  │ Register │  │   Use    │      │
│  │ Services│  │ Service  │  │ Service  │      │
│  └────┬────┘  └────┬────┘  └────┬────┘      │
└───────┼────────────┼─────────────┼────────────┘
        │            │             │
        └────────────┴─────────────┘
                     │
        ┌────────────▼────────────┐
        │   Backend API (Express) │
        │  ┌──────────────────┐   │
        │  │  x402 Handler    │   │
        │  └──────────────────┘   │
        └────────────┬─────────────┘
                     │
        ┌────────────▼────────────┐
        │  Solana Program (Anchor)│
        │  ┌──────────────────┐   │
        │  │ Service Registry │   │
        │  │ Trust Metrics    │   │
        │  └──────────────────┘   │
        └──────────────────────────┘
```

---

## Appendix: Payment Flow Diagram

```
┌────────┐
│ Client │
└───┬────┘
    │ 1. Request Service
    ▼
┌─────────────┐
│   Backend   │
└───┬─────────┘
    │ 2. Forward to Service
    ▼
┌─────────────┐
│   Service   │
└───┬─────────┘
    │ 3. Return 402 Payment Required
    ▼
┌─────────────┐
│   Backend   │
│  (x402)    │
└───┬─────────┘
    │ 4. Create Payment TX
    ▼
┌─────────────┐
│   Solana    │
│  (USDC)     │
└───┬─────────┘
    │ 5. Payment Confirmed
    ▼
┌─────────────┐
│   Backend   │
└───┬─────────┘
    │ 6. Retry with X-PAYMENT header
    ▼
┌─────────────┐
│   Service   │
└───┬─────────┘
    │ 7. Return Data
    ▼
┌─────────────┐
│   Backend   │
│ (Update    │
│  Trust)    │
└───┬─────────┘
    │ 8. Update On-Chain Metrics
    ▼
┌─────────────┐
│   Solana   │
└────────────┘
```

---

**End of Presentation**

