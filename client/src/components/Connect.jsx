import React, {useEffect, useState} from 'react';
import Web3 from 'web3';
import "../style/global.css";
const lottery_contract = require('../contracts/Lottery.json');
const amt_collector_contract = require('../contracts/AmtCollector.json');
const LOTTERY_CONTRACT_ADDR = "0xD095b50110eFCA26F7CB8877F4b4bc0DEaecC581";
const AC_CONTRACT_ADDR = "0x983c46d807FB0e0d7c718f32bfAa8E835E873930";

const Connect = (props) => {
    const [processing, setProcessing] = useState(false);

    const walletConnect = async () => {
        const { ethereum } = window;
        if (!ethereum) {
            alert('Pls install metamask extension');
        } else {
            console.log("Ready to Go!");
        }

        try {
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            console.log("Account addr: ", accounts[0]);
            props.sender(accounts[0]);
            setProcessing(true);
        } catch(err) {
            console.log('Error connecting to wallet')
            console.log('Connecting again');
            walletConnect();
            return;
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