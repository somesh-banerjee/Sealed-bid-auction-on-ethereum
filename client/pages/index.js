import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Layout from '../components/Layout'
import React,{ Component } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Header,Input,Button } from 'semantic-ui-react'
import Crypto from 'crypto';
import web3 from 'web3';


class Auction extends Component{
  state = {
    amount: '',
    company: '',
    encrypted: '',
    key: ''
  }

  onclick = async () => {
    var Key = Crypto.randomBytes(16).toString('hex')
    this.setState({ key: Key })
    var str = Key + this.state.amount + this.state.company
    console.log(this.state.key);
    console.log(this.state.amount.toString());
    console.log(this.state.company.toString());
    console.log(str);
    var message = web3.utils.soliditySha3(str).toString();
    this.setState({ encrypted: message })
  }

  render(){
    return (
      <Layout>
      <div>
        <div className="ui focus input"><input type="text" placeholder="Amount" onChange={event => this.setState({ amount: event.target.value })}/></div>
        <div className="ui focus input"><input type="text" placeholder="Company" onChange={event => this.setState({ company: event.target.value })}/></div>
        <div>
          <Button primary onClick={this.onclick}>Encrypt</Button>
        </div>
        Hash: {this.state.encrypted}
        <p>
        Save your Random key: {this.state.key}</p>
      </div>
      </Layout>
    )
  }
}

export default Auction;
