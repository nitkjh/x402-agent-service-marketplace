/**
 * Simple test x402 service for testing the marketplace
 * Run with: node examples/test-x402-service.js
 */

const express = require('express');
const app = express();

const PORT = 4021;

app.use(express.json());

// Simple x402-protected endpoint
app.get('/test', (req, res) => {
  // Check for payment header
  if (!req.headers['x-payment'] && !req.headers['x-payment-response']) {
    return res.status(402).json({
      error: 'Payment Required',
      message: 'This endpoint requires payment',
      price: '$0.0001',
      // x402 payment details would go here
    });
  }

  // Payment verified (in real implementation, verify payment on-chain)
  res.json({
    success: true,
    message: 'Payment verified! Service accessed successfully.',
    data: {
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(7),
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`✅ Test x402 service running on http://localhost:${PORT}`);
  console.log(`📝 Test endpoint: http://localhost:${PORT}/test`);
  console.log(`💡 Register this URL in the marketplace to test the full flow`);
});

