import { Request, Response } from 'express';
import { Connection } from '@solana/web3.js';
import { getProgram } from '../solana/program';
import { PublicKey } from '@solana/web3.js';

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

export async function listEndpoints(req: Request, res: Response) {
  try {
    const program = getProgram(connection);
    
    // Fetch all service accounts
    const services = await (program.account as any).service.all();
    
    const endpoints = services.map((service: any) => ({
      serviceId: service.account.serviceId,
      owner: service.account.owner.toString(),
      url: service.account.url,
      priceUSDC: service.account.priceUsdc.toString(),
      description: service.account.description,
      successCount: service.account.successCount.toString(),
      failureCount: service.account.failureCount.toString(),
      publicKey: service.publicKey.toString(),
    }));

    res.json({
      success: true,
      endpoints,
      count: endpoints.length,
    });
  } catch (error: any) {
    console.error('List endpoints error:', error);
    res.status(500).json({ error: error.message || 'Failed to list endpoints' });
  }
}

