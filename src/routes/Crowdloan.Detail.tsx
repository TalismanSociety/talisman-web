import styled from 'styled-components'
import { useParams } from "react-router-dom";
import { Pill, Panel } from '@components'
import { useCrowdloanBySlug } from '@libs/talisman'
import { Crowdloan } from '@archetypes'


const CrowdloanDetail = styled(
	({
		className
	}) => {
		const { slug } = useParams()
		const {
			id,
			name,
			subtitle, 
			info
		} = useCrowdloanBySlug(slug)

		return <section
			className={className}
			>
			<Crowdloan.Image 
				id={id}
				poster
			/>
			<div 
				className="content"
				>
				<article>
					<Crowdloan.Icon
					  className="icon"
					  id={id}
					/>
					<header>
						<h1>{name}</h1>
						<h1>{subtitle}</h1>
						<Pill>👱 240 Participants</Pill>
						<p>{info}</p>
					</header>

					{/*<Pendor>
						{status === 'READY'
							? <>
								<img src={icon} alt={``}/>
								<h1>{name}</h1>
								<h2>{subtitle}</h2>
								<p>{info}</p>
								<p>Url: <a href={url} target='_blank' rel="noreferrer">{url}</a></p>
								<hr/>
								<p>Cap: {cap}</p>
								<p>Raised: {raised}</p>
								<p>Deposit: {deposit}</p>
								<p>Period: {firstPeriod}-{lastPeriod}</p>
								<p>End Block: {end}</p>
								<p>Blocks Until End: {end - blockNumber}</p>
								<p>Average Block Time: 6s</p>
								<p>End Time: {moment().add((end - blockNumber) * 6, 'seconds').format('dddd, MMMM Do YYYY, h:mm:ss a')}</p>
								<p>Countdown: <Countdown seconds={(end - blockNumber) * 6} onCompletion={console.log} />
								</p>
							</>
							: null
						}
					</Pendor>*/}
				</article>
				<aside>
					<Panel>
						<Panel.Section
							title='Raised'
							>
							<Crowdloan.Raised id={id}/>
						</Panel.Section>
						<Panel.Section
							title='Ends in'
							>
							<Crowdloan.Countdown
			          id={id}
			          showSeconds={false}
			        />
						</Panel.Section>
							
						<Panel.Section>
							<button>Contribute</button>
						</Panel.Section>
					</Panel>

					<Panel
						title='Rewards'
						>
						[todo]
					</Panel>

					<Panel
						title='Contributors'
						>
						[todo]
					</Panel>
				</aside>
			</div>
		</section>
	})
	`
		>.content{
			max-width: calc(115rem + 10vw);
			margin: 0 auto;
			padding: 0 5vw;
			display: flex;
			justify-content: space-between;

			>article{
				margin-top: -4rem;
				width: 65%;
				header{
					>p{
						margin-top: 2em;
					}
				}
			}

			>aside{
				margin-top: 4rem;
				width: 65%;

				.panel + .panel{
					margin-top: 1.4em;
				}
			}

			
		}
	`

export default CrowdloanDetail