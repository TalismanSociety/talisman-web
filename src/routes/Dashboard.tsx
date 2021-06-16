import styled from 'styled-components'
import { useGuardian, useAccount, useCrowdloans, useApi } from '@libs/talisman'
import { ReactComponent as Loader } from '@icons/loader.svg'

const Dashboard = styled(
	({
		className
	}) => {
		const guardian = useGuardian()//??
		const account = useAccount()
		const crowdloans = useCrowdloans()
		const api = useApi()

		return <div
			className={className}
			>
			<h1>Polkadot.js showcase</h1>
			<h2>Showcase of the data available via polkadot.js lib + extension</h2>

			<div className="cols">
				<span>
					<h3>Extension</h3>
					<p>Status: {guardian?.status}</p>
					{guardian?.message && <p dangerouslySetInnerHTML={{__html: `Message: ${guardian?.message}`}}></p>}
				</span>
				<span>
					<h3>API</h3>
					<p>Status: {api?.status}</p>
					<p>isReady: {api?.isReady.toString()} {!api?.isReady && <Loader/>}</p>
					{api?.message && <p dangerouslySetInnerHTML={{__html: `Message: ${api?.message}`}}></p>}
				</span>
				<span>
					<h3>Account information</h3>
					<p>Name: {account?.name}</p>
					<p>Address: {account?.address}</p>
					<p>Hydrating: {account?.balance?.hydrating?.toString()} {!account?.balance?.hydrating && <button onClick={account.hydrate}>Hydrate</button>}</p>
					<p>Total Balance: {!!account?.balance?.hydrating ? <Loader/> : account?.balance?.total} DOT</p>
					<p>Reserved: {!!account?.balance?.hydrating ? <Loader/> : account?.balance?.reserve} DOT</p>
					<p>Available Balance: {!!account?.balance?.hydrating ? <Loader/> : account?.balance?.available} DOT</p>
				</span>
				<span>
					<h3>TODO</h3>
					<p>🟢 <s>Connect usng polkadot.js lib + extension</s></p>
					<p>🟢 <s>Derive connection status</s></p>
					<p>🟢 <s>Get Accounts</s></p>
					<p>🟢 <s>Create account switcher</s></p>
					<p>⚪ Fetch detailed account info (balance etc, required rpc endpoint)</p>
					<p>⚪ Fetch crowdloan data from ...</p>
					<p>⚪ Define & use crowdloan supplementary config </p>
				</span>
			</div>
		</div>
	})
	`

		.cols{
			display: flex;
			justify-content: space-between;
			>*{
				width: 24%;
				display: block;
				word-wrap: break-word;
			}
		}

		h3{
			margin-top: 2em;
			font-weight: bold;
		}
	`

export default Dashboard