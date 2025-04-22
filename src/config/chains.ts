import { defineChain } from 'viem'

// Define the Sei Testnet
export const seiTestnet = defineChain({
  id: 1328,
  name: 'Sei Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SEI',
    symbol: 'SEI',
  },
  rpcUrls: {
    default: {
      http: ['https://evm-rpc-testnet.sei-apis.com/'],
    },
    public: {
      http: ['https://evm-rpc-testnet.sei-apis.com/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Sei Explorer (Atlantic 2)',
      url: 'https://testnet.seistream.app',
    },
  },
  testnet: true,
})