import {
	Route, 
	Switch,
	Redirect
} from "react-router-dom";
import Showcase from './Showcase.tsx'
import CrowdloanIndex from './Crowdloan.Index.tsx'
import CrowdloanDetail from './Crowdloan.Detail.tsx'

const Routes = () => 
	<Switch>
		<Route 
			exact 
			path="/"
			>
			<CrowdloanIndex/>
		</Route>
		<Route 
			exact 
			path="/crowdloan/:slug"
			>
			<CrowdloanDetail/>
		</Route>
		<Route 
			exact 
			path="/showcase"
			>
			<Showcase/>
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