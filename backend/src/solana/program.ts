import * as anchor from '@coral-xyz/anchor';
import { Program, BN } from '@coral-xyz/anchor';
import { Connection, PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { X402Marketplace } from '../types/x402_marketplace';
import idl from '../idl/x402_marketplace.json';

const PROGRAM_ID = new PublicKey('Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS');

export function getProgram(connection: Connection, wallet?: Keypair): Program<X402Marketplace> {
  const walletAdapter = wallet ? {
    publicKey: wallet.publicKey,
    signTransaction: async (tx: anchor.web3.Transaction) => {
      tx.sign(wallet);
      return tx;
    },
    signAllTransactions: async (txs: anchor.web3.Transaction[]) => {
      txs.forEach(tx => tx.sign(wallet));
      return txs;
    },
  } : {
    publicKey: PublicKey.default,
    signTransaction: async (tx: anchor.web3.Transaction) => tx,
    signAllTransactions: async (txs: anchor.web3.Transaction[]) => txs,
  };

  const provider = new anchor.AnchorProvider(
    connection,
    walletAdapter as anchor.Wallet,
    { commitment: 'confirmed' }
  );
  anchor.setProvider(provider);
  return new Program(idl as any, PROGRAM_ID, provider);
}

export async function getServicePDA(serviceId: string): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('service'), Buffer.from(serviceId)],
    PROGRAM_ID
  );
}

export interface ServiceAccount {
  owner: PublicKey;
  serviceId: string;
  url: string;
  priceUsdc: BN;
  description: string;
  successCount: BN;
  failureCount: BN;
  bump: number;
}

