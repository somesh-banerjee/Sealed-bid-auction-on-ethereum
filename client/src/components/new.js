import Layout from './Layout';
import React, { useState } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Form, Input, Button, Message } from 'semantic-ui-react';
import Manager from '../ethereum/manager';
import web3 from '../ethereum/web3';
import { Redirect } from 'react-router-dom';

const AuctionPage = () => {
	const [Detail, setDetail] = useState('');
	const [errorM, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [amount, setAmount] = useState('');

	const onSubmit = async (e) => {
		setLoading(true);
		try {
			const accounts = await web3.eth.requestAccounts();
			await Manager.methods.createAuction(amount, Detail).send({
				from: accounts[0],
			});
			setRedirect(true);
		} catch (e) {
			setError(e.message);
			console.log(e);
		}
		setLoading(false);
	};

	return (
		<Layout>
			<div>
				{redirect ? <Redirect push to="/" /> : null}
				<Form onSubmit={onSubmit} error={!!errorM}>
					<Form.Field>
						<label>Auction details</label>
						<Input
							placeholder="Base price"
							value={amount}
							onChange={(event) => setAmount(event.target.value)}
							label="ether"
							labelPosition="right"
						/>
						<Input
							placeholder="Spectrum detail"
							value={Detail}
							onChange={(event) => setDetail(event.target.value)}
						/>
					</Form.Field>
					<Message error header="Oops!" content={errorM} />
					<Button primary loading={loading}>
						Create Auction
					</Button>
				</Form>
			</div>
		</Layout>
	);
};

export default AuctionPage;
