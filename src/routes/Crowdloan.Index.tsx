import styled from 'styled-components'
import { useCrowdloanFilter } from '@libs/talisman'
import { Poster, Pill, Filter } from '@components'
import CrowdloanTeaser from '@archetypes/Crowdloan/Teaser.tsx'

const Billboard = styled(
	({
		className,
		...rest
	}) =>
		<Poster
			className={`${className} billboard`}
			{...rest}
			title="It's time to rebuild the system"
			subtitle='Get rewarded for contributing to projects and help fund the future of the Polkadot ecosystem'
			>
			<Pill>💰 24.86M Raised</Pill>
			<Pill>👍 148 Projects Funded</Pill>
			<Pill>😍 2.6K Contributors</Pill>
		</Poster>
	)
	`
		
	`

const FilterBar = styled(
	({
		search='',
		order='',
		setTags=()=>{}, 
		setSearch=()=>{}, 
		setOrder=()=>{},
		orderOptions={},
		tagOptions={},
		className,
		...rest
	}) => 
		<div 
			className={`${className} filterbar`}
			{...rest}
			>
			<span 
				className="left"
				>
				Explore
				<Filter
					options={tagOptions}
					onChange={val => setTags(val)}
				/>
				<input 
					type="text" 
					onChange={e => setSearch(e?.target?.value)}
				/>
			</span>
			<span 
				className="right"
				>
				<select
					onChange={e => setOrder(e?.target?.value)}
					>
					{Object.keys(orderOptions).map(key => 
						<option 
							value={key}
							>
							{orderOptions[key]}
						</option>
					)}
				</select>
			</span>
		</div>
	)
	`
		display: flex;
		width: 100%;
		justify-content: space-between;
		align-items: center;

		>span{
			display: flex;
			align-items: center;
		}
	`

const CrowdloanIndex = styled(
	({
		className
	}) => {
		const { 
			items, 
			status,
			filterProps
		} = useCrowdloanFilter()

		return <div
			className={className}
			>
			<Billboard/>
			<FilterBar
				{...filterProps}
			/>
			<div 
				className="items"
				>
				{status === 'READY' &&
					items.map(({id}) => 
						<CrowdloanTeaser 
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