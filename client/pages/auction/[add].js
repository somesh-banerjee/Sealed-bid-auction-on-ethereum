import Layout from '../../components/Layout'
import React,{ Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form,Input,Button,Message,Card } from 'semantic-ui-react'
import Crypto from 'crypto';
import Auction from '../../ethereum/auction';
import web3 from '../../ethereum/web3';


class AuctionPage extends Component{
  state = {
    amount: '',
    company: '',
    encrypted: '',
    key: '',
    skey: '',
    loading: false,
    loading2: false,
    loading3: false,
    errorMessage: '',
    isVALID: false
  }

  static async getInitialProps(ctx) {
    const auction = Auction(ctx.query.add)
    
    const summary = await auction.methods.getSummary().call();
    const isvlid = await auction.methods.isValid().call();
    //this.setState({ isVALID: isvlid });

    return {
      address: ctx.query.add,
      auctioning: summary[0],
      archive: summary[1],
      buyers_count: summary[2],
      topbidder: summary[3],
      topbid: summary[4],
      baseprice: summary[5],
      auctioner: summary[6],
      isvlid: isvlid
    };
  }

  renderCards() {
    const {
      auctioner, baseprice, buyers_count, topbid, topbidder, auctioning
    } = this.props;

    const items = [
      {
        header: auctioner,
        meta: "address",
        description: "Auctioner",
        style: { overflowWrap: 'break-word' }
      },
      {
        header: baseprice,
        meta: "ether",
        description: "Starting price"
      },
      {
        header: buyers_count,
        meta: "Bidders",
        description: "Number of Participants"
      }
    ];
    if(auctioning==0){
      items.push(
        {
          header: topbid,
          meta: "ether",
          description: "Highest bid Placed"
        },
        {
          header: topbidder,
          meta: "Address",
          description: "Highest Bidder",
          style: { overflowWrap: 'break-word' }
        }
      );
    }


    return <Card.Group items={items} />;
  }

  onSubmit = async () => {
    event.preventDefault();
    this.setState({ loading: true })
    const {address} = this.props;
    const auction = Auction(address)
    if(this.props.auctioning){
      var Key = Crypto.randomBytes(16).toString('hex')
      this.setState({ key: Key })
      var str = Key + this.state.amount + this.state.company
      var message = web3.utils.soliditySha3(str).toString();
      this.setState({ encrypted: message })

      try {
        const accounts = await web3.eth.requestAccounts();
        await auction.methods.placeBid(this.state.encrypted).send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.amount, 'ether')
        });
      } catch (e) {
        this.setState({ errorMessage: e.message});
      }
    }else{
      try {
        const accounts = await web3.eth.requestAccounts();
        await auction.methods.revealBids(this.state.skey, this.state.amount, this.state.company).send({
          from: accounts[0]
        });
      } catch (e) {
        this.setState({ errorMessage: e.message});
      }
    }
    this.setState({ loading: false })
  }

  closeBidding = async () => {
    this.setState({ loading1: true })
    const {address} = this.props;
    const auction = Auction(address)

    try {
      const accounts = await web3.eth.requestAccounts();
      await auction.methods.closeAuction().send({
        from: accounts[0]
      });
    } catch (e) {
      this.setState({ errorMessage: e.message});
    }

    this.setState({ loading1: false })
  }

  closeAuction = async () => {
    this.setState({ loading2: true })
    const {address} = this.props;
    const auction = Auction(address)

    try {
      const accounts = await web3.eth.requestAccounts();
      await auction.methods.stopAll().send({
        from: accounts[0]
      });
    } catch (e) {
      this.setState({ errorMessage: e.message});
    }

    this.setState({ loading2: false })
  }

  render(){
    return (
      <Layout>
        <div style={{marginBottom:'30px'}}>
          {this.renderCards()}
        </div>
        <Message info hidden={this.props.auctioning || this.props.archive} header="The auction is not closed yet. The highest bid and highest bidder can change" />
        <Message error hidden={this.props.isvlid} header="The auction is currently Invalid because it has two topbidders. And will be considered INVALID if top bidder is not unique by the end of the auction." />
        <Button floated="right"
          content="Close Auction"
          negative
          loading={this.state.loadin2}
          onClick={this.closeAuction}
        />
        <Button floated="right"
          content="Close Bidding"
          primary={true}
          loading={this.state.loading1}
          onClick={this.closeBidding}
        />
        <div style={{width:'30%'}}>
        <h3>Place your bid</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
          <label>Bid details</label>
          <Input
            placeholder='Bid amount'
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
            label="ether" labelPosition="right"
          />
          <Input
            placeholder='Company ID'
            value={this.state.company}
            onChange={event => this.setState({ company: event.target.value })}
          />
          <Input
            placeholder='Key'
            value={this.state.skey}
            onChange={event => this.setState({ skey: event.target.value })}
            disabled={this.props.auctioning}
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Message info hidden={!this.state.key} header="Please Save the key for future reference" content={this.state.key} />
        <Button primary loading={this.state.loading && this.props.auctioning} disabled={!this.props.auctioning}>
          Place Bid
        </Button>
        <Button primary loading={this.state.loading && !this.props.auctioning} disabled={this.props.auctioning}>
          Reveal Bid
        </Button>
        </Form>
        </div>
      </Layout>
    )
  }
}

export default AuctionPage;
