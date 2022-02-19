import React from "react";
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Home from "./components/home";
import newAuction from "./components/new";
import auctionDetail from "./components/auction";

function App() {
	return (
		<Router>
			
			<Route exact path='/' component={Home} />
			<Route path='/new' component={newAuction} />
			<Route path='/auction/:id' component={auctionDetail} />
	
		</Router>
	);
}

export default App;
