import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading, IconButton, AddIcon, MinusIcon, useModal } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import useStake from 'hooks/useStake'
import useUnstake from 'hooks/useUnstake'
import { getBalanceNumber } from 'utils/formatBalance'
import DepositModal from '../DepositModal'
import WithdrawModal from '../WithdrawModal'
import CardValue from '../CardValue'
import CakeHarvestBalance from '../CakeHarvestBalance'


interface FarmCardActionsProps {
  lpName?: string
  stakedBalance?: BigNumber
  tokenBalance?: BigNumber
  quoteTokenBalance?: BigNumber
  tokenName?: string
  pid?: number
  depositFeeBP?: number
}

const StyledInfoCard = styled.div`
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
    width: 48%;
    flex-grow: 1;
    text-align: center;
  }

  .item + .item{
    margin-left: 2%;
  } 
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const IconButtonWrapper = styled.div`
  display: flex;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmCardActionsProps> = ({ lpName, stakedBalance, tokenBalance, quoteTokenBalance, tokenName, pid, depositFeeBP}) => {
  const TranslateString = useI18n()
  const { onStake } = useStake(pid)
  const { onUnstake } = useUnstake(pid)

  const rawStakedBalance = getBalanceNumber(stakedBalance)

  console.log(rawStakedBalance)
  
  // const displayBalance = stakedBalance.( 6 )
  // console.log( stakedBalance)
  const [onPresentDeposit] = useModal(<DepositModal max={tokenBalance} onConfirm={onStake} tokenName={tokenName} depositFeeBP={depositFeeBP} />)
  const [onPresentWithdraw] = useModal(
    <WithdrawModal max={stakedBalance} onConfirm={onUnstake} tokenName={tokenName} />,
  )

  const renderStakingButtons = () => {
    return rawStakedBalance === 0 ? (
      <Button onClick={onPresentDeposit}>{TranslateString(999, 'Stake')}</Button>
    ) : (
      <IconButtonWrapper>
        <Button  onClick={onPresentWithdraw} mr="6px">
          Withdraw
        </Button>
        <Button onClick={onPresentDeposit}>
          Deposit
        </Button>
      </IconButtonWrapper>
    )
  }

  return (
    <StyledInfoCard>
      <div className="item">
        <Label>{lpName} Staked</Label>
        <CakeHarvestBalance earningsSum={rawStakedBalance} fontSize="28px" decimals={6} />
        <CardValue color='textSubtle' value={quoteTokenBalance.toNumber()} decimals={2} prefix="~$" fontSize="14px" />
      </div>
      <div className="item">
        {renderStakingButtons()}
      </div>
    </StyledInfoCard>
  )
}

export default StakeAction
