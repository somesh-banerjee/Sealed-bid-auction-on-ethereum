import Layout from '../../components/Layout'
import React,{ Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form,Input,Button,Message } from 'semantic-ui-react'
import Crypto from 'crypto';
import Auction from '../../ethereum/auction';
import web3 from '../../ethereum/web3';


class AuctionPage extends Component{
  state = {
    amount: '',
    company: '',
    encrypted: '',
    key: '',
    loading: false,
    errorMessage: ''
  }

  

  onSubmit = async () => {
    event.preventDefault();
    var Key = Crypto.randomBytes(16).toString('hex')
    this.setState({ loading: true })
    this.setState({ key: Key })
    var str = Key + this.state.amount + this.state.company
    var message = web3.utils.soliditySha3(str).toString();
    this.setState({ encrypted: message })

    const pthnm = window.location.pathname
    const address = pthnm.substring('/auction/'.length)
    console.log(address);
    const auction = Auction(address)

    try {
      const accounts = await web3.eth.requestAccounts();
      await auction.methods.placeBid(this.state.encrypted).send({
        from: accounts[0]
      });
    } catch (e) {
      this.setState({ errorMessage: e.message});
    }

    this.setState({ loading: false })
  }

  render(){
    return (
      <Layout>
        <div style={{width:'30%'}}>
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
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Message info hidden={!this.state.key} header="Please Save the key for future reference" content={this.state.key} />
        <Button primary loading={this.state.loading}>
          Place Bid
        </Button>
        </Form>
        </div>
      </Layout>
    )
  }
}

export default AuctionPage;
