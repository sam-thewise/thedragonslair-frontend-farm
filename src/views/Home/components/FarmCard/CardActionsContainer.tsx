import React, { useMemo, useState, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { provider } from 'web3-core'
import { getContract } from 'utils/erc20'
import { Button, Flex, Text } from '@pancakeswap-libs/uikit'
import { Farm } from 'state/types'
import { useFarmFromPid, useFarmFromSymbol, useFarmUser } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import StakeAction from './StakeAction'
import HarvestAction from './HarvestAction'
import CakeHarvestBalance from '../CakeHarvestBalance'
import CardValue from '../CardValue'

const Action = styled.div`
  padding-top: 16px;
`
const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const StyledInfoCard = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;
  flex-shrink: 2;

  .inner-container{
    display: flex;
  }

  .inner-container .item.shrink{
    flex-shrink: 2;
    flex-grow: revert;
  }

  .inner-container .item.full{
    width: 100%;
  }

  .item{
    flex-grow: 1;
    text-align: center;
  }

  .item + .item{
    margin-left: 2%;
  } 
`

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses, tokenAddresses, isTokenOnly, depositFeeBP } = useFarmFromPid(farm.pid)
  const { allowance, tokenBalance, stakedBalance, earnings,  } = useFarmUser(pid)
  const lpAddress = lpAddresses[process.env.REACT_APP_CHAIN_ID]
  const tokenAddress = tokenAddresses[process.env.REACT_APP_CHAIN_ID];
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  let totalValueUser = new BigNumber(0)

  let stakedBalanceDecimalsFixed = new BigNumber(  0 )

  let earningsFixed = new BigNumber( earnings)
  let earningDollars = new BigNumber( 0 )

  if (farm.userData) 
  {
    stakedBalanceDecimalsFixed = new BigNumber( farm.userData.stakedBalance ).div(new BigNumber(10).pow(farm.tokenDecimals))

    earningsFixed = new BigNumber(earnings).div( new BigNumber(10).pow(18));

    earningDollars = earningsFixed.times( farm.tokenPriceVsQuote )


    if( farm.isTokenOnly )
    {
      const userValue = stakedBalanceDecimalsFixed.times( farm.tokenPriceVsQuote )

      totalValueUser = totalValueUser.plus( userValue )
    } else {
      // users staked in full number format
      const userStakesFullInLPToken = new BigNumber(farm.userData.stakedBalance)
      
      // Ratio in % a LP tokens that the user has staking, vs the total number in circulation
      const userTokenRatio = userStakesFullInLPToken.div(new BigNumber(farm.lpTotalSupply))

      // we work out how much of the users tokens are in the staking pool in the quote token
      const userLPTokens = new BigNumber(farm.quoteTokenBalanceLP)
        .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
        .times(new BigNumber(2))
        .times(userTokenRatio)

      totalValueUser = totalValueUser.plus( userLPTokens )
    }
  }

  const lpContract = useMemo(() => {
    if(isTokenOnly){
      return getContract(ethereum as provider, tokenAddress);
    }
    return getContract(ethereum as provider, lpAddress);
  }, [ethereum, lpAddress, tokenAddress, isTokenOnly])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction lpName={lpName} stakedBalance={stakedBalance} quoteTokenBalance={totalValueUser} tokenBalance={tokenBalance} tokenName={lpName} pid={pid} depositFeeBP={depositFeeBP} />
    ) : (
      <Button mt="8px" fullWidth disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(999, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <>
        <div className="item shrink">
          <Label>DREGG Earned</Label>
          <CakeHarvestBalance earningsSum={earningsFixed.toNumber()} fontSize="28px" decimals={2} />
          <CardValue color='textSubtle' value={earningDollars.toNumber()} decimals={2} prefix="~$" fontSize="14px" />
        </div>
        <div className="item shrink">
          <HarvestAction earnings={earnings} pid={pid} />
        </div>
      {!account ? <div className="item full"><UnlockButton mt="8px" fullWidth /></div> : renderApprovalOrStakeButton()}
    </>
  )
}

export default CardActions
