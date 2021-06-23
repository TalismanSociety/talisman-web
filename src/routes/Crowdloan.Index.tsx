import { Link } from "react-router-dom";
import styled from 'styled-components'
import { useCrowdloans } from '@libs/talisman'

const CrowdloanIndex = styled(
	({
		className
	}) => {
		const crowdloans = useCrowdloans()

		return <div
			className={className}
			>
			<h1>Crowdloan index</h1>

			<p>Status: {crowdloans.status}</p>
			<p>Message: {crowdloans.message}</p>
			<p>isReady: {(crowdloans.status === 'READY').toString()}</p>
			<p>Count: {crowdloans.items.length}</p>
			<div className="items">
				{crowdloans.status === 'READY' &&
					crowdloans.items.map(({name, slug, icon}) => 
						<Link
							to={`/crowdloan/${slug}`}
							>
							<h2>{name}</h2>
							<img 
								src={icon} 
								alt={`mising ${name} icon`}
								style={{
									width:'4em',
									height:'4em'
								}}
							/>
						</Link>
					)
				}
			</div>

		</div>
	})
	`
		.items{
			display: flex;
			flex-wrap: wrap;
			align-items: stretch;
			align-content: stretch;
			>*{
				width: 20%;
				display: block;
				border: 1px solid lightgrey;
				padding: 1em;
			}
		}

	`

export default CrowdloanIndex