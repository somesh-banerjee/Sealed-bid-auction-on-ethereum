import Layout from './Layout'
import React,{ useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form,Input,Button,Message } from 'semantic-ui-react'
import Manager from '../ethereum/manager';
import web3 from '../ethereum/web3';
import { Redirect } from "react-router-dom";

const AuctionPage = () => {
  const [newAucDetail,setDetail] = useState({
    amount: '',
    detail: '',
    loading: false,
    errorMessage: '',
    url: '/new'
  })

  const onSubmit = async () => {
    setDetail({ loading: true })
    try {
      const accounts = await web3.eth.requestAccounts();
      await Manager.methods.createAuction(this.state.amount, this.state.detail).send({
        from: accounts[0]
      });
      //Router.pushRoute('/');
      setDetail({ url: '/' })
    } catch (e) {
      setDetail({ errorMessage: e.message});
    } 

    setDetail({ loading: false })
  }

  return (
    <Layout>
      <Redirect to={newAucDetail.url} />
      <div>
      <Form onSubmit={onSubmit} error={!!newAucDetail.errorMessage}>
        <Form.Field>
        <label>Auction details</label>
        <Input
          placeholder='Base price'
          value={newAucDetail.amount}
          onChange={event => setDetail({ amount: event.target.value })}
          label="ether" labelPosition="right"
        />
        <Input
          placeholder='Spectrum detail'
          value={newAucDetail.detail}
          onChange={event => setDetail({ detail: event.target.value })}
        />
      </Form.Field>
      <Message error header="Oops!" content={newAucDetail.errorMessage} />
      <Button primary loading={newAucDetail.loading}>
        Create Auction
      </Button>
      </Form>
      </div>
    </Layout>
  )
}

export default AuctionPage;
