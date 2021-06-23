import styled from 'styled-components'
import { useParams } from "react-router-dom";
import moment from 'moment'
import { Pendor, Countdown } from '@components'
import { useCrowdloanBySlug, useGuardian } from '@libs/talisman'

const CrowdloanDetail = styled(
	({
		className
	}) => {
		const { slug } = useParams()
		const {
			name,
			subtitle, 
			info,
			icon,
			status,
			raised,
			cap,
			deposit,
			firstPeriod,
			lastPeriod,
			url,
			end
		} = useCrowdloanBySlug(slug)
		const {
			metadata: {
				blockNumber
			}
		} = useGuardian()

		//const endTime = moment.duration((end - blockNumber) * 6, 'seconds')

		return <div
			className={className}
			>
			<Pendor>
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
			</Pendor>
		</div>
	})
	`
		
	`

export default CrowdloanDetail