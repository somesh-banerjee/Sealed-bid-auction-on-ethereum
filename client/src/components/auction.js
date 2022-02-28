import Layout from './Layout'
import React,{ useEffect, useState } from 'react'
import 'semantic-ui-css/semantic.min.css'
import { Form,Input,Button,Message,Card } from 'semantic-ui-react'
import Crypto from 'crypto';
import Auction from '../ethereum/auction';
import web3 from '../ethereum/web3';


const AuctionPage = ({ match }) => {
  
  const [Stts,setStts] = useState({
    amount: '',
    company: '',
    encrypted: '',
    key: '',
    skey: '',
    loading: false,
    loading2: false,
    loading3: false,
    errorMessage: '',
    isVALID: true,
    address: ''
  });

  useEffect(() => {
    const getAuctionDetails = async() => {
      const auction_address = match.params.id
      const auction = Auction(auction_address)
      
      const summary = await auction.methods.getSummary().call();
      const isvlid = await auction.methods.isValid().call();

      setStts((prev)=>{
        return {
          ...prev,
          address: auction_address,
          auctioning: summary[0],
          archive: summary[1],
          buyers_count: summary[2],
          topbidder: summary[3],
          topbid: summary[4],
          baseprice: summary[5],
          auctioner: summary[6],
          isvlid: isvlid
        }
      })
    };
    getAuctionDetails()
  },[match.params.id])

  const renderCards = () => {

    const items = [
      {
        header: Stts.auctioner,
        meta: "address",
        description: "Auctioner",
        style: { overflowWrap: 'break-word' }
      },
      {
        header: Stts.baseprice,
        meta: "ether",
        description: "Starting price"
      },
      {
        header: Stts.buyers_count,
        meta: "Bidders",
        description: "Number of Participants"
      }
    ];
    if(Stts.auctioning === 0){
      items.push(
        {
          header: Stts.topbid,
          meta: "ether",
          description: "Highest bid Placed"
        },
        {
          header: Stts.topbidder,
          meta: "Address",
          description: "Highest Bidder",
          style: { overflowWrap: 'break-word' }
        }
      );
    }


    return <Card.Group items={items} />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setStts((prev)=>{
      return {
        ...prev,
        loading: true
      }
    })
    const auction = Auction(Stts.address)
    if(Stts.auctioning){
      var Key = Crypto.randomBytes(16).toString('hex')
      var str = Key + Stts.amount + Stts.company
      var message = web3.utils.soliditySha3(str).toString();
      setStts((prev)=>{
        return {
          ...prev,
          encrypted: message
        }
      })

      try {
        const accounts = await web3.eth.requestAccounts();
        await auction.methods.placeBid(Stts.encrypted).send({
          from: accounts[0],
          value: web3.utils.toWei(Stts.amount, 'ether')
        });
        
        setStts((prev)=>{
          return {
            ...prev,
            key: Key
          }
        })
      } catch (e) {
        setStts((prev)=>{
          return {
            ...prev,
            errorMessage: e.message
          }
        })
      }
    }else{
      try {
        const accounts = await web3.eth.requestAccounts();
        await auction.methods.revealBids(Stts.skey, Stts.amount, Stts.company).send({
          from: accounts[0]
        });
      } catch (e) {
        setStts((prev)=>{
          return {
            ...prev,
            errorMessage: e.message
          }
        })
      }
    }
    setStts((prev)=>{
      return {
        ...prev,
        loading: false
      }
    })
  }

  const closeBidding = async () => {
    setStts((prev)=>{
      return {
        ...prev,
        loading3: true
      }
    })
    const auction = Auction(Stts.address)

    try {
      const accounts = await web3.eth.requestAccounts();
      await auction.methods.closeAuction().send({
        from: accounts[0]
      });
    } catch (e) {
      setStts((prev)=>{
        return {
          ...prev,
          errorMessage: e.message
        }
      })
    }

    setStts((prev)=>{
      return {
        ...prev,
        loading3: false
      }
    })
  }

  const closeAuction = async () => {
    setStts((prev)=>{
      return {
        ...prev,
        loading2: true
      }
    })
    const auction = Auction(Stts.address)

    try {
      const accounts = await web3.eth.requestAccounts();
      await auction.methods.stopAll().send({
        from: accounts[0]
      });
    } catch (e) {
      setStts((prev)=>{
        return {
          ...prev,
          errorMessage: e.message
        }
      })
      console.log(Stts.errorMessage);
      console.log(e.message);
    }
    
    setStts((prev)=>{
      return {
        ...prev,
        loading2: false
      }
    })
  }

  return (
    <Layout>
      <div style={{marginBottom:'30px'}}>
        {renderCards()}
      </div>
      <Message info hidden={Stts.auctioning || Stts.archive} header="The auction is not closed yet. The highest bid and highest bidder can change" />
      <Message error hidden={Stts.isVALID} header="The auction is currently Invalid because it has two topbidders. And will be considered INVALID if top bidder is not unique by the end of the auction." />
      <Button floated="right"
        content="Close Auction"
        negative
        loading={Stts.loading2}
        onClick={closeAuction}
      />
      <Button floated="right"
        content="Close Bidding"
        primary={true}
        loading={Stts.loading3}
        onClick={closeBidding}
      />
      <div style={{width:'30%'}}>
      <h3>Place your bid</h3>
      <Form onSubmit={onSubmit} error={!!Stts.errorMessage}>
        <Form.Field>
        <label>Bid details</label>
        <Input
          placeholder='Bid amount'
          value={Stts.amount}
          onChange={event => setStts((prev)=>{
            return {
              ...prev,
              amount: event.target.value
            }
          })}
          label="ether" labelPosition="right"
        />
        <Input
          placeholder='Company ID'
          value={Stts.company}
          onChange={event => setStts((prev)=>{
            return {
              ...prev,
              company: event.target.value
            }
          })}
        />
        <Input
          placeholder='Key'
          value={Stts.skey}
          onChange={event => setStts((prev)=>{
            return {
              ...prev,
              skey: event.target.value
            }
          })}
          disabled={Stts.auctioning}
        />
      </Form.Field>
      <Message error header="Oops!" content={Stts.errorMessage} />
      <Message info hidden={!Stts.key} header="Please Save the key for future reference" content={Stts.key} />
      <Button primary loading={Stts.loading && Stts.auctioning} disabled={!Stts.auctioning}>
        Place Bid
      </Button>
      <Button primary loading={Stts.loading && !Stts.auctioning} disabled={Stts.auctioning}>
        Reveal Bid
      </Button>
      </Form>
      </div>
    </Layout>
  )
}

export default AuctionPage;
