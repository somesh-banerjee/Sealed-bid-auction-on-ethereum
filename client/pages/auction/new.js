import Layout from '../../components/Layout'
import React,{ Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form,Input,Button,Message } from 'semantic-ui-react'
import Manager from '../../ethereum/manager';
import Auction from '../../ethereum/auction';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';


class AuctionPage extends Component{
  state = {
    amount: '',
    detail: '',
    loading: false,
    errorMessage: ''
  }

  onSubmit = async () => {
    event.preventDefault();
    this.setState({ loading: true })
    try {
      const accounts = await web3.eth.requestAccounts();
      await Manager.methods.createAuction(this.state.amount, this.state.detail).send({
        from: accounts[0]
      });
      Router.pushRoute('/');
    } catch (e) {
      this.setState({ errorMessage: e.message});
    }

    this.setState({ loading: false })
  }

  render(){
    return (
      <Layout>
        <div>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
          <label>Auction details</label>
          <Input
            placeholder='Base price'
            value={this.state.amount}
            onChange={event => this.setState({ amount: event.target.value })}
            label="ether" labelPosition="right"
          />
          <Input
            placeholder='Spectrum detail'
            value={this.state.detail}
            onChange={event => this.setState({ detail: event.target.value })}
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button primary loading={this.state.loading}>
          Create Auction
        </Button>
        </Form>
        </div>
      </Layout>
    )
  }
}

export default AuctionPage;
