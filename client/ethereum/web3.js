import Web3 from 'web3';

let web3;

if(typeof window !== 'undefined' && window.web3 !== 'undefined'){
	web3 = new Web3(window.ethereum);
} else {
	const provider = new Web3.providers.HttpProvider(
			'https://rinkeby.infura.io/v3/'
			//'http://127.0.0.1:7545'
		);
	web3 = new Web3(provider);
}

export default web3;
