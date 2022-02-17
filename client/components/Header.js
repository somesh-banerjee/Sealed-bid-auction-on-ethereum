import React from 'react';
import { Link } from '../routes';

const Header = () =>{
	return (
		<div style={{font:'small-caps bold 48px Georgia, serif'}}>
			<Link route="/">
			<a style={{color:'black',marginTop:'20px',marginBottom:'1px'}}>Sealed Bid Auction</a>
			</Link>
			<hr style={{top:'1px',left:'1px',height:'5px',backgroundColor:'black'}}/>
		</div>
	);
};

export default Header
