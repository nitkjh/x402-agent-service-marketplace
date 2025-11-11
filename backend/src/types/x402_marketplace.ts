import { Idl } from '@coral-xyz/anchor';

export interface X402Marketplace extends Idl {
  "version": "0.1.0",
  "name": "x402_marketplace",
  "address": string;
  "metadata": {
    "name": string;
    "version": string;
    "spec": string;
  };
  "instructions": [
    {
      "name": "registerService",
      "accounts": [
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "serviceId",
          "type": "string"
        },
        {
          "name": "url",
          "type": "string"
        },
        {
          "name": "priceUsdc",
          "type": "u64"
        },
        {
          "name": "description",
          "type": "string"
        }
      ]
    },
    {
      "name": "updateTrustMetrics",
      "accounts": [
        {
          "name": "service",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "success",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "service",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "serviceId",
            "type": "string"
          },
          {
            "name": "url",
            "type": "string"
          },
          {
            "name": "priceUsdc",
            "type": "u64"
          },
          {
            "name": "description",
            "type": "string"
          },
          {
            "name": "successCount",
            "type": "u64"
          },
          {
            "name": "failureCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
}

