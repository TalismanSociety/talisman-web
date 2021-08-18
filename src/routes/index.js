import {
	Route, 
	Switch,
	Redirect
} from "react-router-dom";
import CrowdloanIndex from './Crowdloan.Index.tsx'
import CrowdloanDetail from './Crowdloan.Detail.tsx'
import Wallet from './Wallet.tsx'

const Routes = () => 
	<Switch>
		<Route 
			exact 
			path="/"
			>
			<Wallet/>
		</Route>
		<Route 
			exact 
			path="/crowdloans"
			>
			<CrowdloanIndex/>
		</Route>
		<Route 
			exact 
			path="/crowdloans/:slug"
			>
			<CrowdloanDetail/>
		</Route>
		<Route 
			path="*"
			>
			<Redirect 
				to="/"
			/>
		</Route>
	</Switch>


export default Routes