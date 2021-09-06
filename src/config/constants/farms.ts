import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 5,
    isTokenOnly: true,
    lpSymbol: 'DREGG',
    lpAddresses: {
      43114: '',
      43113: '0x7c1674166715d6ec204161fa0f9f748d735aed8f', // DREGG-USDT LP
    },
    tokenSymbol: 'DREGG',
    tokenAddresses: {
      43114: '',
      43113: '0x89a89f0ac95990306e1aAC2BCBe6e717dF961e8c',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'DREGG-USDT.e LP',
    lpAddresses: {
      43114: '',
      43113: '0x7c1674166715D6ec204161fa0f9f748D735aeD8f',
    },
    tokenSymbol: 'DREGG',
    tokenAddresses: {
      43114: '',
      43113: '0x89a89f0ac95990306e1aAC2BCBe6e717dF961e8c',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'WAVAX-USDT.e LP',
    lpAddresses: {
      43114: '',
      43113: '0x32e99C4B59316F285eaa9bA202A109421f9b87d0',
    },
    tokenSymbol: 'WAVAX',
    tokenAddresses: {
      43114: '',
      43113: '0xd00ae08403b9bbb9124bb305c09058e32c39a48c',
    },
    quoteTokenSymbol: QuoteToken.USDTe,
    quoteTokenAdresses: contracts.usdte,
  },
]

export default farms
