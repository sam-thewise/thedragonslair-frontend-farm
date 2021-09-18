import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'DREGG',
    lpAddresses: {
      43114: '0xB52a2b91Bf89BcB9435ad94D23555EaD26954CA9',
      43113: '', // DREGG-USDT LP
    },
    tokenSymbol: 'DREGG',
    tokenAddresses: {
      43114: '0x88c090496125b751b4e3ce4d3fdb8e47dd079c57',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'DREGG-USDT.e LP',
    lpAddresses: {
      43114: '0xB52a2b91Bf89BcB9435ad94D23555EaD26954CA9',
      43113: '',
    },
    tokenSymbol: 'DREGG',
    tokenAddresses: {
      43114: '0x88c090496125b751b4e3ce4d3fdb8e47dd079c57',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 3,
    risk: 5,
    lpSymbol: 'DREGG-WAVAX LP',
    lpAddresses: {
      43114: '0x6c4339a47aa98cb5759d4b5c4058a30620ee46a5',
      43113: '',
    },
    tokenSymbol: 'DREGG',
    tokenAddresses: {
      43114: '0x88c090496125b751b4e3ce4d3fdb8e47dd079c57',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.WAVAX,
    quoteTokenAdresses: contracts.wavax,
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'WAVAX-USDT.e LP',
    lpAddresses: {
      43114: '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
      43113: '',
    },
    tokenSymbol: 'WAVAX',
    tokenAddresses: {
      43114: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 4,
    risk: 3,
    lpSymbol: 'WAVAX',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0xed8cbd9f0ce3c6986b22002f03c6475ceb7a6256',
      43113: '',
    },
    tokenSymbol: 'WAVAX',
    tokenAddresses: {
      43114: '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 5,
    risk: 3,
    lpSymbol: 'USDT.e',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0xB52a2b91Bf89BcB9435ad94D23555EaD26954CA9',
      43113: '',
    },
    tokenSymbol: 'USDT.e',
    tokenAddresses: {
      43114: '0xc7198437980c041c805a1edcba50c1ce5db95118',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 13,
    risk: 3,
    lpSymbol: 'DAI.e',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0xa6908c7e3be8f4cd2eb704b5cb73583ebf56ee62',
      43113: '',
    },
    tokenSymbol: 'DAI.e',
    tokenAddresses: {
      43114: '0xd586e7f844cea2f87f50152665bcbc2c279d8d70',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 6,
    risk: 3,
    lpSymbol: 'TUNDRA',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x317598200315f454D1B5e5cccf07c2e2c6aEE172',
      43113: '',
    },
    tokenSymbol: 'TUNDRA',
    tokenAddresses: {
      43114: '0x21c5402C3B7d40C89Cc472C9dF5dD7E51BbAb1b1',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 7,
    risk: 3,
    lpSymbol: 'WETH.e',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0xbe1b87f47fDE3F338Aa3AA98b85435e1709dFD06',
      43113: '',
    },
    tokenSymbol: 'WETH.e',
    tokenAddresses: {
      43114: '0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 8,
    risk: 3,
    lpSymbol: 'JOE',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x1643de2efb8e35374d796297a9f95f64c082a8ce',
      43113: '',
    },
    tokenSymbol: 'JOE',
    tokenAddresses: {
      43114: '0x6e84a6216ea6dacc71ee8e6b0a5b7322eebc0fdd',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 9,
    risk: 3,
    lpSymbol: 'PNG',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x1ffb6ffc629f5d820dcf578409c2d26a2998a140',
      43113: '',
    },
    tokenSymbol: 'PNG',
    tokenAddresses: {
      43114: '0x60781c2586d68229fde47564546784ab3faca982',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 10,
    risk: 3,
    lpSymbol: 'PEFI',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x51604d6da13c5d7b0c55a01ff8f5b9041af9a67a',
      43113: '',
    },
    tokenSymbol: 'PEFI',
    tokenAddresses: {
      43114: '0xe896cdeaac9615145c0ca09c8cd5c25bced6384c',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 11,
    risk: 3,
    lpSymbol: 'YAK',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x980965fDf2f3FD0F10D88BcDcEeA146A4c7a1363',
      43113: '',
    },
    tokenSymbol: 'YAK',
    tokenAddresses: {
      43114: '0x59414b3089ce2af0010e7523dea7e2b35d776ec7',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 12,
    risk: 3,
    lpSymbol: 'ELK',
    isTokenOnly: true,
    lpAddresses: {
      43114: '0x213E14EfEab6654d803589b621A5Cd106d233573',
      43113: '',
    },
    tokenSymbol: 'ELK',
    tokenAddresses: {
      43114: '0xe1c110e1b1b4a1ded0caf3e42bfbdbb7b5d7ce1c',
      43113: '',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  }
]

export default farms
