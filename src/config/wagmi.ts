'use client'

import { http, createConfig } from 'wagmi'
import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { mainnet } from 'wagmi/chains'
import { seiTestnet } from './chains'

// No need to redefine seiTestnet since we're importing it from ./chains.ts

const { connectors } = getDefaultWallets({
  appName: 'SeiForge',
  projectId: 'b8ad206ba9492e6096fa0aa0f868586c', // Replace with your WalletConnect Project ID
})

export const config = createConfig({
  chains: [seiTestnet],
  transports: {
    [seiTestnet.id]: http(seiTestnet.rpcUrls.default.http[0]),
  },
  connectors,
}) 