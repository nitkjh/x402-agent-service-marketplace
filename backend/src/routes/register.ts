import { Request, Response } from 'express';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getProgram, getServicePDA } from '../solana/program';
import * as anchor from '@coral-xyz/anchor';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

export async function registerEndpoint(req: Request, res: Response) {
  try {
    const { serviceId, url, priceUSDC, description, ownerPrivateKey } = req.body;

    if (!serviceId || !url || priceUSDC === undefined || !description) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse owner keypair
    let owner: Keypair;
    if (ownerPrivateKey) {
      const secretKey = Uint8Array.from(JSON.parse(ownerPrivateKey));
      owner = Keypair.fromSecretKey(secretKey);
    } else {
      return res.status(400).json({ error: 'Owner private key required' });
    }

    const program = getProgram(connection, owner);
    const [servicePDA] = getServicePDA(serviceId);

    // Check if service already exists
    try {
      await (program.account as any).service.fetch(servicePDA);
      return res.status(400).json({ error: 'Service already registered' });
    } catch (e) {
      // Service doesn't exist, proceed with registration
    }

    const priceUsdcBN = new anchor.BN(priceUSDC);

    const tx = await program.methods
      .registerService(serviceId, url, priceUsdcBN, description)
      .accounts({
        service: servicePDA,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    res.json({
      success: true,
      transaction: tx,
      serviceId,
      servicePDA: servicePDA.toString(),
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
}

