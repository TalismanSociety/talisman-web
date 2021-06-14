import styled from 'styled-components'
import { useGuardian, useAccount } from '@libs/talisman'

const Dashboard = styled(
	({
		className
	}) => {
		const guardian = useGuardian()//??
		const account = useAccount()

		///console.log(111, aaa)

		return <div
			className={className}
			>
			<h1>Polkadot.js showcase</h1>
			<h2>Showcase of the data available via polkadot.js lib + extension</h2>
			
			<h3>Extension</h3>
			<p>Status: {guardian?.status}</p>
			{guardian?.message && <p dangerouslySetInnerHTML={{__html: `Message: ${guardian?.message}`}}></p>}

			<h3>Account information</h3>
			<p>Name: {account?.name}</p>
			<p>Address: {account?.address}</p>
			<p>Total Balance: {account?.balance?.total} DOT [TODO]</p>
			<p>Reserved: {account?.balance?.reserve} DOT [TODO]</p>
			<p>Available Balance: {account?.balance?.available} DOT [TODO]</p>
			

			<h3>TODO</h3>
			<p>🟢 <s>Connect usng polkadot.js lib + extension</s></p>
			<p>🟢 <s>Derive connection status</s></p>
			<p>🟢 <s>Get Accounts</s></p>
			<p>🟢 <s>Create account switcher</s></p>
			<p>⚪ Fetch account info (balance etc)</p>
			<p>⚪ ...more</p>
		</div>
	})
	`
		h3{
			margin-top: 2em;
			font-weight: bold;
		}
	`

export default Dashboard