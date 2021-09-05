import React from 'react'
import { Text } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import useI18n from 'hooks/useI18n'
import useAllEarnings from 'hooks/useAllEarnings'
import CardValue from './CardValue'

const CakeHarvestBalance = ({decimals, earningsSum, suffix = "", doNotLock = false, fontSize = "35px"}) => {

  const TranslateString = useI18n()
  const { account } = useWallet()

  if (!account && !doNotLock) {
    return (
      <Text color="textDisabled" fontSize={fontSize} style={{ lineHeight: '60px' }}>
        {TranslateString(298, 'Locked')}
      </Text>
    )
  }

  return <CardValue decimals={decimals} fontSize={fontSize} value={earningsSum} suffix={suffix} />
}

export default CakeHarvestBalance
