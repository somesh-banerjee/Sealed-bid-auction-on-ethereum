import React from 'react';
import { Link } from "react-router-dom";

const Header = () =>{
	return (
		<div style={{font:'small-caps bold 48px Georgia, serif'}}>
			<Link to="/">
				<p style={{color:'black',marginTop:'20px',marginBottom:'1px'}}>Sealed Bid Auction</p>
			</Link>
			<hr style={{top:'1px',left:'1px',height:'5px',backgroundColor:'black'}}/>
		</div>
	);
};

export default Header
