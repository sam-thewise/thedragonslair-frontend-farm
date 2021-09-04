import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, Text } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import { usePriceDreggUsdt } from '../../../state/hooks'
import useTokenBalance from '../../../hooks/useTokenBalance'
import { getCakeAddress } from '../../../utils/addressHelpers'
import useAllEarnings from '../../../hooks/useAllEarnings'
import { getBalanceNumber } from '../../../utils/formatBalance'
import CardValue from './CardValue'

interface FarmStakingCardProps {
  totalValueLockedUser: BigNumber,
  farmsCountStakedUser: number
}

const StyledFarmStakingCard = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 16px;

  .inner-container{
    display: flex;
  }

  .inner-container .item.shrink{
    flex-shrink: 2;
    flex-grow: revert;
  }

  .item{
    flex-grow: 1;
    text-align: center;
  }

  .item + .item{
    margin-left: 2%;
  } 
`

const Block = styled.div`
  margin-bottom: 16px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Actions = styled.div`
  margin-top: 24px;
`

const FarmedStakingCard : React.FC<FarmStakingCardProps> = ({ totalValueLockedUser, farmsCountStakedUser }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { account } = useWallet()
  const farmsWithBalance = useFarmsWithBalance()
  const cakeBalance = getBalanceNumber(useTokenBalance(getCakeAddress()))
  const eggPrice = usePriceDreggUsdt().toNumber()
  const allEarnings = useAllEarnings()
  const earningsSum = allEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)

  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  return (
    <StyledFarmStakingCard>
      <div className="item shrink">
          <Label><strong>Your Total Staked</strong></Label>

          <CardValue value={totalValueLockedUser.toNumber()} decimals={2} prefix="$" />
          { farmsCountStakedUser > 0 ? (
            <Label><strong>Across {farmsCountStakedUser} Pool(s)</strong></Label>
          )
          : (
            <Label>Not staked in any pool(s)</Label>
          )}
      </div>
      <div className="item">
        <div className="inner-container">
          <div className="item shrink">
            <CardImage src="/images/egg/DREGG.png" alt="Dragon Egg" width={64} height={64} />
          </div>
          <div className="item shrink">
            
            <Label><strong>DREGG to Harvest</strong></Label>
            <CakeHarvestBalance decimals={2} earningsSum={earningsSum}/>
            <Label><strong>~${(eggPrice * earningsSum).toFixed(2)}</strong></Label>
          </div>
        </div>
      </div>
      <div className="item">
        {account ? (
          <Button
            id="harvest-all"
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
            fullWidth
          >
            {pendingTx
              ? 'Collecting DREGG'
              : `Harvest all (${balancesWithValue.length})`}
          </Button>
        ) : (
          <UnlockButton fullWidth />
        )}
      </div>
      
    </StyledFarmStakingCard>
  )
}

export default FarmedStakingCard
