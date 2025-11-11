import { Request, Response } from 'express';
import { Connection, Keypair, Transaction } from '@solana/web3.js';
import { getProgram, getServicePDA } from '../solana/program';
import { wrap } from '@faremeter/fetch';
import { createPaymentHandler } from '@faremeter/payment-solana-exact';
import axios from 'axios';
import * as anchor from '@coral-xyz/anchor';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

// USDC mint on devnet (Solana devnet USDC)
// Note: For devnet, you may need to use a test token or configure your own
// This is a placeholder - update with actual devnet USDC mint or use test token
const USDC_MINT = new anchor.web3.PublicKey('4zMMC9srt5Ri5X14GAgX6H8Sx6ZqKJdq7T4D5N2K7vFq');

export async function useService(req: Request, res: Response) {
  try {
    const { serviceId, requestData, clientPrivateKey } = req.body;

    if (!serviceId || !clientPrivateKey) {
      return res.status(400).json({ error: 'Missing serviceId or clientPrivateKey' });
    }

    const program = getProgram(connection);
    const [servicePDA] = getServicePDA(serviceId);

    // Fetch service details
    const service = await (program.account as any).service.fetch(servicePDA);
    const serviceUrl = service.url as string;
    const priceUsdc = service.priceUsdc as anchor.BN;

    // Create client wallet from private key
    const secretKey = Uint8Array.from(JSON.parse(clientPrivateKey));
    const clientWallet = Keypair.fromSecretKey(secretKey);

    // Create payment handler
    const paymentHandler = createPaymentHandler(
      {
        publicKey: clientWallet.publicKey,
        signTransaction: async (tx: Transaction): Promise<Transaction> => {
          tx.sign(clientWallet);
          return tx;
        },
        signAllTransactions: async (txs: Transaction[]): Promise<Transaction[]> => {
          txs.forEach((tx: Transaction) => tx.sign(clientWallet));
          return txs;
        },
      } as any,
      USDC_MINT,
      connection
    );

    // Wrap fetch with x402 payment
    const fetchWithPayment = wrap(globalThis.fetch as typeof fetch, {
      handlers: [paymentHandler],
    });

    let success = false;
    let result: any = null;
    let paymentTx: string | null = null;

    try {
      // Make request with x402 payment wrapper
      const response = await fetchWithPayment(serviceUrl, {
        method: requestData?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...requestData?.headers,
        },
        body: requestData?.body ? JSON.stringify(requestData.body) : undefined,
      });

      success = response.ok;
      result = await response.json().catch(() => ({ status: response.status, statusText: response.statusText }));

      // Extract payment transaction from response headers if available
      const paymentHeader = response.headers.get('x-payment-response');
      if (paymentHeader) {
        try {
          const paymentData = JSON.parse(paymentHeader);
          paymentTx = paymentData.transaction || null;
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error: any) {
      console.error('Service call error:', error);
      success = false;
      result = { error: error.message };
    }

    // Update trust metrics on-chain
    try {
      // For demo purposes, we'll use a backend authority key
      // In production, this should be a dedicated authority
      const authorityKey = process.env.AUTHORITY_PRIVATE_KEY;
      if (authorityKey) {
        const authoritySecret = Uint8Array.from(JSON.parse(authorityKey));
        const authority = Keypair.fromSecretKey(authoritySecret);
        const programWithAuth = getProgram(connection, authority);

        await programWithAuth.methods
          .updateTrustMetrics(success)
          .accounts({
            service: servicePDA,
            authority: authority.publicKey,
          })
          .rpc();
      }
    } catch (error: any) {
      console.error('Failed to update trust metrics:', error);
      // Don't fail the request if trust metrics update fails
    }

    res.json({
      success: true,
      serviceId,
      result,
      paymentTx,
      trustMetrics: {
        successCount: success ? (service.successCount as anchor.BN).toNumber() + 1 : (service.successCount as anchor.BN).toNumber(),
        failureCount: success ? (service.failureCount as anchor.BN).toNumber() : (service.failureCount as anchor.BN).toNumber() + 1,
      },
    });
  } catch (error: any) {
    console.error('Use service error:', error);
    res.status(500).json({ error: error.message || 'Failed to use service' });
  }
}

