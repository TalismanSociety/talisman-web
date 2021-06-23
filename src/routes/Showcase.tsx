import { useState } from 'react'
import styled from 'styled-components'
import { find } from 'lodash'
import { useGuardian, useAccount, useCrowdloans, useApi } from '@libs/talisman'
import { Pendor } from '@components'
import { ReactComponent as Loader } from '@icons/loader.svg'

const Dashboard = styled(
	({
		className
	}) => {
		const guardian = useGuardian()
		const account = useAccount()
		const crowdloans = useCrowdloans()
		const api = useApi()

		const [selectedCrowdLoan, setSelectedCrowdloan] = useState({})

		return <div
			className={className}
			>
			<h1>Polkadot.js showcase</h1>
			<h2>Showcase of the data available via polkadot.js lib + extension</h2>

			<div 
				className="cols"
				>
				<span>
					<h3>Extension</h3>
					<p>Status: {guardian?.status}</p>
					{guardian?.message && <p dangerouslySetInnerHTML={{__html: `Message: ${guardian?.message}`}}></p>}
				</span>
				<span>
					<h3>API</h3>
					<p>Status: {api?.status} {!api?.isReady && <Loader/>}</p>
					<p>isReady: <Pendor>{!!api?.isReady && 'true'}</Pendor></p>
					{api?.message && <p dangerouslySetInnerHTML={{__html: `Message: ${api?.message}`}}></p>}
				</span>
				<span>
					<h3>Network/Node</h3>
					<p>Chain: <Pendor>{guardian?.metadata?.chain}</Pendor></p>
					<p>Token Symbol: <Pendor>{guardian?.metadata?.tokenSymbol}</Pendor></p>
					<p>Token Decimals: <Pendor>{guardian?.metadata?.tokenDecimals}</Pendor></p>
					<p>Node Name: <Pendor>{guardian?.metadata?.nodeName}</Pendor></p>
					<p>Node Version: <Pendor>{guardian?.metadata?.nodeVersion}</Pendor></p>
					<p>Latest Block: <Pendor>{guardian?.metadata?.blockNumber}</Pendor></p>
					<p>Latest Hash: <Pendor>{guardian?.metadata?.blockHash}</Pendor></p>
				</span>
				<span>
					<h3>Account</h3>
					<p>Name: {account?.name}</p>
					<p>Address: {account?.address}</p>
					<p>Hydrating: {account?.balance?.hydrating?.toString()}</p>
					<p>Total Balance: <Pendor suffix=' DOT'>{account?.balance?.total}</Pendor></p>
					<p>Reserved: <Pendor suffix=' DOT'>{account?.balance?.reserve}</Pendor></p>
					<p>Available Balance: <Pendor suffix=' DOT'>{account?.balance?.available}</Pendor></p>
				</span>
				<span>
					<h3>Crowdloans</h3>
					<p>Status: {crowdloans.status}</p>
					<p>Message: {crowdloans.message}</p>
					<p>isReady: {(crowdloans.status === 'READY').toString()}</p>
					<p>Count: {crowdloans.items.length}</p>
					{crowdloans.status === 'READY' && 
						<select
							value={selectedCrowdLoan.id}
							onChange={({target}) => setSelectedCrowdloan(find(crowdloans.items, {id: target.value})||{})}
							>
							<option value="-1">Select Item</option>
							{
								crowdloans.items.map(({id, name}) => 
									<option 
										value={id}
										key={id}
										>
										{name||id}
									</option>
								)
							}
						</select>
					}
					{!!selectedCrowdLoan?.id &&
						<fieldset>
							<legend>{selectedCrowdLoan.name}</legend>
							<img src={selectedCrowdLoan.icon} alt='icon'/>
							{Object.keys(selectedCrowdLoan).map(key => typeof selectedCrowdLoan[key] !== 'object' && 
								<span 
									className='small'
									key={key}
									>
									{key}: {selectedCrowdLoan[key]}
								</span>
							)}
						</fieldset>
					}		
				</span>
				<span>
					<h3>TODO</h3>
					<p data-s>🟢 Connect usng polkadot.js lib + extension</p>
					<p data-s>🟢 Derive connection status</p>
					<p data-s>🟢 Get Accounts</p>
					<p data-s>🟢 Create account switcher</p>
					<p data-s>🟢 Fetch detailed account info (balance etc, required rpc endpoint)</p>
					<p data-s>🟢 Fetch crowdloan data from ...</p>
					<p data-s>🟢 Define & use crowdloan supplementary config</p>
					<p>⚪ Implement routes</p>
					<p>⚪ Basic layout</p>
					<p>⚪ Localstorage for quick hydration</p>
					<p>⚪ Implement designs (pending designs)</p>
				</span>
			</div>
		</div>
	})
	`
		.cols{
			display: flex;
			justify-content: space-between;
			>*{
				width: calc(100%/6*.95);
				display: block;
				word-wrap: break-word;
			}
		}

		h3{
			margin-top: 2em;
			font-weight: bold;
		}

		p{
			font-size: 14px;

			&[data-s]{
				text-decoration: line-through
			}
		}

		fieldset{
			border: 1px solid rgba(0,0,0,0.1);
			display: block;
			min-width: 0;
			img{
				width: 4rem;
				height: 4rem
			}

			span.small{
				display: block;
				font-size: 0.8em;
				opacity: 0.7;
				line-height: 1.7em;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	`

export default Dashboard