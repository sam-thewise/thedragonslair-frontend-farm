import React, { useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import styled, { keyframes } from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap-libs/uikit'
import { communityFarms } from 'config/constants'
import { Farm } from 'state/types'
import { provider } from 'web3-core'
import useI18n from 'hooks/useI18n'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { QuoteToken } from 'config/constants/types'
import DetailsSection from './DetailsSection'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import ApyButton from './ApyButton'
import CakeHarvestBalance from '../CakeHarvestBalance'

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

const FCard = styled.div`
  align-self: baseline;
  background: ${(props) => props.theme.card.background};
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  text-align: center;
  margin-bottom: 16px;

  .details{
    width: 100%;
  }

  .item.shrink button{
    margin-top: 16px !important;
  }
`

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.borderColor};
  height: 1px;
  margin: 28px auto;
  width: 100%;
`

const ExpandingWrapper = styled.div<{ expanded: boolean }>`
  height: ${(props) => (props.expanded ? '100%' : '0px')};
  overflow: hidden;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

interface FarmCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  cakePrice?: BigNumber
  bnbPrice?: BigNumber
  ethereum?: provider
  account?: string
}

const FarmCard: React.FC<FarmCardProps> = ({ farm, removed, cakePrice, bnbPrice, ethereum, account }) => {
  const TranslateString = useI18n()

  const [showExpandableSection, setShowExpandableSection] = useState(false)

  // const isCommunityFarm = communityFarms.includes(farm.tokenSymbol)
  // We assume the token name is coin pair + lp e.g. CAKE-BNB LP, LINK-BNB LP,
  // NAR-CAKE LP. The images should be cake-bnb.svg, link-bnb.svg, nar-cake.svg
  // const farmImage = farm.lpSymbol.split(' ')[0].toLocaleLowerCase()
  const farmImage = farm.isTokenOnly ? farm.tokenSymbol.toLowerCase() : `${farm.tokenSymbol.toLowerCase()}-${farm.quoteTokenSymbol.toLowerCase()}`

  const totalValue: BigNumber = useMemo(() => {

    if (!farm.lpTotalInQuoteToken) {
      // console.log('null value')
      return null
    }
    if (farm.quoteTokenSymbol === QuoteToken.WAVAX) {
      return bnbPrice.times(farm.lpTotalInQuoteToken)
    }
    if (farm.quoteTokenSymbol === QuoteToken.DREGG) {
      return cakePrice.times(farm.lpTotalInQuoteToken)
    }
    return farm.lpTotalInQuoteToken
  }, [bnbPrice, cakePrice, farm.lpTotalInQuoteToken, farm.quoteTokenSymbol])

  const totalValueFormated = totalValue
    ? `$${Number(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    : '-'

  const lpLabel = farm.lpSymbol
  const earnLabel = 'DREGG'
  const farmAPYNumber =  farm.apy && farm.apy.times(new BigNumber(100)).toNumber()
  const farmAPY = farmAPYNumber.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  const { quoteTokenAdresses, quoteTokenSymbol, tokenAddresses, risk } = farm

  return (
    <FCard>
      <div className="heading item">
        <CardHeading
          lpLabel={lpLabel}
          multiplier={farm.multiplier}
          risk={risk}
          depositFee={farm.depositFeeBP}
          farmImage={farmImage}
          tokenSymbol={farm.tokenSymbol}
        />
      </div>
      {!removed && (
        <div className="apr item">
          
            
            {farm.apy ? (
              <>
                <Label>
                  APR 
                </Label>

                <Text color="text" bold fontSize="28px">
                  {farmAPY}%
                </Text>

                <Label className="textSubtle">
                  <ApyButton
                      lpLabel={lpLabel}
                      quoteTokenAdresses={quoteTokenAdresses}
                      quoteTokenSymbol={quoteTokenSymbol}
                      tokenAddresses={tokenAddresses}
                      cakePrice={cakePrice}
                      apy={farm.apy}
                    />
                </Label>
              </>
            ) : (
              <Skeleton height={24} width={80} />
            )}
        </div>
      )}
      <CardActionsContainer farm={farm} ethereum={ethereum} account={account} />
      <div className="details">
        <Divider />
        <ExpandableSectionButton
          onClick={() => setShowExpandableSection(!showExpandableSection)}
          expanded={showExpandableSection}
        />
        <ExpandingWrapper expanded={showExpandableSection}>
          <DetailsSection
            removed={removed}
            isTokenOnly={farm.isTokenOnly}
            bscScanAddress={
              farm.isTokenOnly ?
                `https://cchain.explorer.avax.network/tokens/${farm.tokenAddresses[process.env.REACT_APP_CHAIN_ID]}`
                :
                `https://cchain.explorer.avax.network/tokens/${farm.lpAddresses[process.env.REACT_APP_CHAIN_ID]}`
            }
            totalValueFormated={totalValueFormated}
            lpLabel={lpLabel}
            quoteTokenAdresses={quoteTokenAdresses}
            quoteTokenSymbol={quoteTokenSymbol}
            tokenAddresses={tokenAddresses}
          />
        </ExpandingWrapper>
      </div>
    </FCard>
  )
}

export default FarmCard
