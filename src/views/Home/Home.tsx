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

const ContentWrapper = styled.div`
  background: rgba(97,105,182,0.75);
  padding: 16px;
  padding-top: 32px;
  margin-bottom: 16px;
  border-radius: 3px;
  border: 1px solid #efcd52;
  backdrop-filter: blur(3px);
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

const StickySideBar = styled.div`
  position: fixed;
  top: 150px;
  left: 0;
`

const TelegramLink = styled.a`
  font-weight: bold;
  text-decoration: underline;
  color: #efcd5;
`

const StickyIcons = styled.a`
  display: block;
  text-align: center;
  padding: 1px;
  color: white;
  font-size: 20px;
  max-width: 38px;
  height: auto;
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
        const userLPTokens = new BigNumber(farm.quoteTokenBalanceLP)
          .div(new BigNumber(10).pow(farm.quoteTokenDecimals))
          .times(new BigNumber(2))
          .times(userTokenRatio)

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
      <StickySideBar>
        <StickyIcons href="https://t.me/thedragonslairfarm" target="_blank">
            <img alt="telegram" src="https://image.flaticon.com/icons/png/512/124/124019.png"/>
        </StickyIcons>
        <StickyIcons href="https://twitter.com/DRGNCRYPTOGAMIN" target="_blank">
            <img alt="twitter" src="https://seeklogo.com/images/T/twitter-icon-square-logo-108D17D373-seeklogo.com.png"/>
        </StickyIcons>
        <StickyIcons href="https://docs.thedragonslair.farm/" target="_blank">
            <img alt="docs" src="https://cdn2.iconfinder.com/data/icons/metro-ui-dock/512/Doc_-_Google_Docs.png"/>
        </StickyIcons>
        <StickyIcons href="https://chartex.pro/?symbol=AVAX_TRADERJOE%3ADREGG%2FUSDTe.0xB52a2b91Bf89BcB9435ad94D23555EaD26954CA9" target="_blank">
            <img alt="charts" src="https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/512x512/plain/chart_candlestick.png"/>
        </StickyIcons>
        <StickyIcons href="https://www.traderjoexyz.com/#/trade?outputCurrency=0x88c090496125b751B4E3ce4d3FDB8E47DD079c57" target="_blank">
            <img alt="exchange" src="https://styles.redditmedia.com/t5_4wqgbi/styles/communityIcon_hwxlimnujqh71.png?width=256&s=940b200ec6f27d13edd81f0ce89eba62e765d3d1"/>
        </StickyIcons>
      </StickySideBar>
    
      <Page>
        <Hero>
          <Heading as="h1" size="xl" mb="24px" color="secondary">
            The Dragon&apos;s Lair &ndash; Avalanche Yield Farm
            
          </Heading>
        </Hero>

        <ContentWrapper>
          <div>
            <Heading as="h2" fontSize="26px" mb="12px" mt="-10px" size="l">
              The website will be live once our Stealth Launch has started. 
            </Heading>

            <CountdownBox>
              <Text color="textSubtle">
                Block Countdown to Farm Start: <strong>{currentBlock}</strong>
              </Text>
            </CountdownBox>

            <Text color="textSubtle">Do not try to stake on the website. Contract is not live until after Stealth Launch.</Text>
            <Text color="text">DREGG is now available on <TelegramLink rel="noreferrer" target="_blank" href="https://www.traderjoexyz.com/#/trade?outputCurrency=0x88c090496125b751B4E3ce4d3FDB8E47DD079c57">Trader Joe, click here to buy DREGG</TelegramLink>.</Text> 
            <Text color="text">Please join our <TelegramLink rel="noreferrer" target="_blank" href="https://t.me/thedragonslairfarm">Telegram</TelegramLink> for further updates.</Text> 
            <Text color="text">Stealth Launch is on the <strong>8th of September.</strong></Text> 
            <Text color="text">Farming Launches on the <strong>10th of September.</strong></Text>
          </div>
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
