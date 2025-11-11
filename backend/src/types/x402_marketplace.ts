import { Idl } from '@coral-xyz/anchor';

// Use Idl type directly - the JSON IDL will be validated at runtime
// This avoids TypeScript strict type checking issues with IDL structure
export type X402Marketplace = Idl;
