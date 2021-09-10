import styled from 'styled-components'
import useI18n from 'hooks/useI18n'
import React, { useEffect, useCallback, useState } from 'react'
import { Route, useRouteMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useBlock from 'hooks/useBlock'
import { BLOCKS_PER_YEAR, CAKE_PER_BLOCK, CAKE_POOL_PID } from 'config'

import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { provider } from 'web3-core'
import { Heading, BaseLayout, Text, Link } from '@pancakeswap-libs/uikit'
import Page from 'components/layout/Page'
import { useFarms, usePriceWavaxUsdt, usePriceDreggUsdt } from 'state/hooks'
import useRefresh from 'hooks/useRefresh'
import { fetchFarmUserDataAsync } from 'state/actions'
import { QuoteToken } from 'config/constants/types'

import FarmStakingCard from './components/FarmStakingCard'
import CakeStats from './components/CakeStats'
import TotalValueLockedCard from './components/TotalValueLockedCard'

import FarmCard, { FarmWithStakedValue } from './components/FarmCard/FarmCard'
import FarmTabButtons from './components/FarmTabButtons'
import FarmStatsWithTvl from './components/FarmStatsWithTvl'


const ContentWrapper = styled.div`
  background: rgba(97,105,182,0.75);
  padding: 16px;
  padding-top: 32px;
  margin-bottom: 16px;
  border-radius: 3px;
  border: 1px solid #efcd52;
  backdrop-filter: blur(4px);
`

const DarkContentWrapper = styled.div`
  background: rgba(0,0,0,0.75);
  padding: 16px;
  padding-top: 32px;
  margin-bottom: 16px;
  border-radius: 3px;
  border: 1px solid #efcd52;
  backdrop-filter: blur(3px);
`

const Hero = styled.div`
  margin-bottom: 32px;
  text-align: left;

  h1{
    color: #fff;
  }
`

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 48px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const TelegramLink = styled.a`
  font-weight: bold;
  text-decoration: underline;
  color: #efcd5;
`

const CountdownBox = styled.div`
  text-align: center;
  padding: 16px;
  border: 1px solid #fff;
  border-radius: 3px;
  margin-bottom: 16px;
`



const Home: React.FC = ( ) => {
  const { path } = useRouteMatch()
  const TranslateString = useI18n()
  const farmsLP = useFarms()
  const cakePrice = usePriceDreggUsdt()
  const bnbPrice = usePriceWavaxUsdt()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const tokenMode = false;

  const dispatch = useDispatch()
  const { fastRefresh } = useRefresh()
  useEffect(() => {
    if (account) {
      dispatch(fetchFarmUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])

  const [stakedOnly, setStakedOnly] = useState(false)

  const activeFarms = farmsLP.filter((farm) => farm.multiplier !== '0X')
  const inactiveFarms = farmsLP.filter((farm) => farm.multiplier === '0X')

  
  const liveBlock = 4086720
  let currentBlock = liveBlock - useBlock()

  if( currentBlock < 0 )
  {
    currentBlock = 0;
  }

  let totalValueUser = new BigNumber(0);
  let totalFarmsUser = 0;

  const stakedOnlyFarms = activeFarms.filter(
    (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  )

  stakedOnlyFarms.forEach(farm => {
    if( farm.userData )
    {
      totalFarmsUser++

      if( farm.isTokenOnly )
      {
        const stakedBalanceDecimalsFixed = new BigNumber( farm.userData.stakedBalance ).div(new BigNumber(10).pow(farm.tokenDecimals))
        const userValue = stakedBalanceDecimalsFixed.times( farm.tokenPriceVsQuote )

        totalValueUser = totalValueUser.plus( userValue )
      } else {
        // users staked in full number format
        const userStakesFullInLPToken = new BigNumber(farm.userData.stakedBalance)
        
         // Ratio in % a LP tokens that the user has staking, vs the total number in circulation
        const userTokenRatio = userStakesFullInLPToken.div(new BigNumber(farm.lpTotalSupply))

        // we work out how much of the users tokens are in the staking pool in the quote token
        let userLPTokens = new BigNumber(farm.quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
          .times(new BigNumber(2))
          .times(userTokenRatio)

          if(farm.quoteTokenSymbol === "WAVAX"){
            const usdValueOfWavaxLpTokens = userLPTokens.times(bnbPrice);
            userLPTokens = usdValueOfWavaxLpTokens;
          }

        totalValueUser = totalValueUser.plus( userLPTokens )
      }
      
    }
  });

  // /!\ This function will be removed soon
  // This function compute the APY for each farm and will be replaced when we have a reliable API
  // to retrieve assets prices against USD
  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      // const cakePriceVsBNB = new BigNumber(farmsLP.find((farm) => farm.pid === CAKE_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   return farm
        // }
        const cakeRewardPerBlock = new BigNumber(farm.eggPerBlock || 1).times(new BigNumber(farm.poolWeight)) .div(new BigNumber(10).pow(18))
        const cakeRewardPerYear = cakeRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = cakePrice.times(cakeRewardPerYear);

        let totalValue = new BigNumber(farm.lpTotalInQuoteToken || 0);

        if (farm.quoteTokenSymbol === QuoteToken.WAVAX) {
          totalValue = totalValue.times(bnbPrice);
        }

        if(totalValue.comparedTo(0) > 0){
          apy = apy.div(totalValue);
        }

        return { ...farm, apy }
      })
      return farmsToDisplayWithAPY.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          removed={removed}
          bnbPrice={bnbPrice}
          cakePrice={cakePrice}
          ethereum={ethereum}
          account={account}
        />
      ))
    },
    [bnbPrice, account, cakePrice, ethereum],
  )

  return (
    <div>
      <Page>
        <Hero>
          <Heading as="h1" size="xl" mb="24px" color="secondary">
            The Dragon&apos;s Lair &ndash; Avalanche Yield Farm
            
          </Heading>
        </Hero>

        <ContentWrapper>
            <Cards>
                <div className="twitter-box">
                  <a className="twitter-timeline" data-width="500" data-height="430" data-theme="light" href="https://twitter.com/DRGNCRYPTOGAMIN?ref_src=twsrc%5Etfw">Tweets by DRGNCRYPTOGAMIN</a> 
                </div>
              <FarmStatsWithTvl/>
            </Cards>
          
        </ContentWrapper>

        <DarkContentWrapper>
          <div>
            <FarmStakingCard totalValueLockedUser={totalValueUser} farmsCountStakedUser={totalFarmsUser} />
          </div>
        </DarkContentWrapper>
        
        <ContentWrapper>
          <div>
            <div>
              <FarmTabButtons stakedOnly={stakedOnly} setStakedOnly={setStakedOnly}/> 

              <Route exact path={`${path}`}>
                {stakedOnly ? farmsList(stakedOnlyFarms, false) : farmsList(activeFarms, false)}
              </Route>
            </div>
          </div>
          <div>
            <Cards>
              <CakeStats />
              <TotalValueLockedCard />
            </Cards>
          </div>
        </ContentWrapper>
      </Page>
    </div>
  )
}

export default Home
