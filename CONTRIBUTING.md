# Contributing to x402 Agent Service Marketplace

Thank you for your interest in contributing!

## Development Setup

1. Install prerequisites (see [MANUAL_SETUP.md](MANUAL_SETUP.md))
2. Clone the repository
3. Install dependencies:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
4. Build and deploy the program:
   ```bash
   anchor build
   anchor deploy --provider.cluster devnet
   ```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add comments for complex logic
- Update documentation for new features

## Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Questions?

Open an issue or reach out to the maintainers.

