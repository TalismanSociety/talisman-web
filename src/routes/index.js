import {
	Route, 
	Switch,
	Redirect
} from "react-router-dom";
import Dashboard from './Dashboard.tsx'
import ChainDetail from './ChainDetail.tsx'

const Routes = () => 
	<Switch>
		<Route 
			exact 
			path="/"
			>
			<Dashboard/>
		</Route>
		<Route 
			exact 
			path="/chains/"
			>
			<ChainDetail/>
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