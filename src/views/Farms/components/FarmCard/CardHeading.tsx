import React from 'react'
import styled from 'styled-components'
import { Tag, Flex, Heading, Image } from '@pancakeswap-libs/uikit'
import { CommunityTag, CoreTag, NoFeeTag, RiskTag } from 'components/Tags'

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  risk?: number
  depositFee?: number
  farmImage?: string
  tokenSymbol?: string
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 0.25rem;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

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
    flex-grow: 1;
    text-align: center;
  }

  .item + .item{
    margin-left: 2%;
  } 
`

const CardHeading: React.FC<ExpandableSectionProps> = ({
  lpLabel,
  multiplier,
  risk,
  farmImage,
  tokenSymbol,
  depositFee,
}) => {
  return (
    <StyledInfoCard>
      <div className="item">
        <Image src={`/images/farms/${farmImage}.png`} alt={tokenSymbol} width={64} height={64} />
      </div>
      <div className="item shrink">
        <Heading mb="4px">{lpLabel}</Heading>
          {depositFee === 0 ? <NoFeeTag /> : null}
          <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
      </div>
    </StyledInfoCard>
  )
}

export default CardHeading
