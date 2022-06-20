import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import "../style/global.css";
import detectEthereumProvider from '@metamask/detect-provider';

/*
const lottery_abi = require('../contracts/Lottery.json');
const LOTTERY_CONTRACT_ADDR = "0x31C65D465d605A4A7dc7B4008dE791F28CE523ea";
addr = 0xB5156847d6A926e68FC600a1176b071D872c26e2
*/


const Connect = (props) => {
    const [processing, setProcessing] = useState(false);
    const {ethereum} = window;

    const walletConnect = async () => {
        const provider = await detectEthereumProvider();
        if (!provider) {
            alert('Please install Metamask extension!');
            return;
        }

        if (provider !== window.ethereum) {
            alert('Wallets mismatch!');
            return;
        }

        try {

            const chainId = await ethereum.request({method: 'eth_chainId'});
            console.log(chainId);
            if (chainId !== "0x4") {
                alert('You must connect to rinkeby test network!!');
                return;
            }
        
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log("Account addr: ", accounts[0]);
            props.sender(accounts[0]);
            setProcessing(true);
        }

        catch(err) {
            console.log('Error connecting to wallet')
            console.log('Connecting again');
            walletConnect();
        }

        return await props.flag(1);
        
    }

    const handleClick = async (e) => {

        if (!processing) {
            walletConnect();
        }
        return;   
    }

    const handleWinnersClick = async () => {
        await props.backFlag(0);
        await props.flag(4);
        return;
    }


    return (
        <div className="landing">
            <div className="header">
                <div className="app-title">LOTTERY10</div>
                <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
            </div>
                <button className="btn-connect" onClick={handleClick}>
                    Connect To Wallet
                </button>
            <p className="footer">
                &copy;2022 React App. All rights reserved
            </p>
        </div>
    );
}

export default Connect;