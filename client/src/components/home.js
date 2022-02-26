import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Card, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Manager from './../ethereum/manager';

function App() {
	const [auction, getAuctions] = useState({
		add: [],
		details: [],
	});

	useEffect(() => {
		const getAuctionDetails = async () => {
			const auctions = await Manager.methods.getAuctions().call();
			const auctionsdetails = await Manager.methods.getDetails().call();
			getAuctions({
				add: auctions,
				details: auctionsdetails,
			});
		};
		getAuctionDetails();
	}, []);

	return (
		<Layout>
			<div>
				<Link to="/new">
					<p>
						<Button
							floated="right"
							content="New Auction"
							icon="add circle"
							primary={true}
						/>
					</p>
				</Link>
				<Card.Group
					items={auction.add.map((address, i) => {
						return {
							header: auction.details[i],
							description: (
								<Link to={`/auction/${address}`}>
									<p>View Auction</p>
								</Link>
							),
							fluid: true,
						};
					})}
				/>
			</div>
		</Layout>
	);
}

export default App;
