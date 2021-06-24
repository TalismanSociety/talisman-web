import styled from 'styled-components'
import { useCrowdloans } from '@libs/talisman'
import { Poster, Pill } from '@components'
import { Crowdloan } from '@archetypes'

const CrowdloanIndex = styled(
	({
		className
	}) => {
		const { items, status } = useCrowdloans()

		return <div
			className={className}
			>
			<Poster
				title="It's time to rebuild the system"
				subtitle='Get rewarded for contributing to projects and help fund the future of the Polkadot ecosystem'
				>
				<Pill>test</Pill>
				<Pill>test</Pill>
				<Pill>test</Pill>
			</Poster>

			<div 
				className="filterbar"
				>
				<span 
					className="left"
					>
					Explore
					<Pill>All</Pill>
					<Pill>DeFi</Pill>
					<Pill>NFTs</Pill>
					<Pill>Infra</Pill>
				</span>
				<span 
					className="right"
					>
					(SEARCH)
				</span>
			</div>

			<div className="items">
				{status === 'READY' &&
					items.map(({id}) => 
						<Crowdloan.Teaser 
							key={id} 
							id={id}
						/>
					)
				}
			</div>

		</div>
	})
	`
		.filterbar{
			padding: 2.4rem;
		}

		.items{
			display: grid;
			grid-gap: 2.4rem;
			width: 100%;
			grid-template-columns: repeat(4, 1fr);
			padding: 0 2.4rem 2.4rem 2.4rem;
		}
	`

export default CrowdloanIndex