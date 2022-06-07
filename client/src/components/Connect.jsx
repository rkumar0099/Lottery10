import React, {useState} from 'react';
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
        } catch(err) {
            console.log(err);
            props.flag(0);
        }

        const web3 = new Web3(ethereum.provider || "http://127.0.0.1:8545");
        if (web3 === undefined) {
            alert('web3 not init');
        }

        console.log(web3);
        const c1 = new web3.eth.Contract(lottery_contract.abi, LOTTERY_CONTRACT_ADDR);
        const c2 = new web3.eth.Contract(amt_collector_contract.abi, AC_CONTRACT_ADDR)
        console.log('Contract Lottery ', c1);
        console.log('Contract Amt ', c2);
        await props.contract(c1);
        await props.contractAmt(c2);
        await props.flag(1);
    }

    const handleClick = async (e) => {

        if (!processing) {
            walletConnect();
            setProcessing(true);
        } else {
            console.log('You must connect to your wallet');
            const {ethereum} = window;
            ethereum.walletConnect();
            e.preventDefault();
        }   
    }

    return (
        <div className="landing">
            <div className="wrapper">
                <h2 className="header">LOTTERY10</h2>
            </div>

            <div className="wrapper">
                <button className="connect-btn" onClick={handleClick}>
                    Connect To Wallet
                </button>
            </div>

            <div className="wrapper">
                <p className="footer">
                    &copy;2022 React App. All rights reserved
                </p>
            </div>
        </div>
    );
}

export default Connect;