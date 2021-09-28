import Layout from '../components/Layout'
import React,{ Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Card,Button } from 'semantic-ui-react';
import Manager from '../ethereum/manager';
import { Link } from '../routes';

class Home extends Component{
  static async getInitialProps() {
		const auctions = await Manager.methods.getAuctions().call();
    const auctionsdetails = await Manager.methods.getDetails().call();
    return { auctions,auctionsdetails };
	}

	renderCards() {
		const items = this.props.auctions.map(address => {
			return {
				header: address,
				description: (
          <Link route={`/auction/${address}`}>
						<a>View Auction</a>
					</Link>
				),
				fluid: true
			};
		});
    for(var i in items){
      items[i].header = this.props.auctionsdetails[i]
    }
		return <Card.Group items={items} />;
	}

  render(){
    return (
      <Layout>
        <div>
          {this.renderCards()}
        </div>
      </Layout>
    )
  }
}

export default Home;
