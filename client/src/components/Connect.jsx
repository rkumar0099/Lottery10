import React, {useState} from 'react';
import Web3 from 'web3';
import "../style/global.css";
import {abi} from '../contracts/Lottery.json';
const ADDR = "0x9026DDE269FCd01748DF4F145ea1A0054DB2f86D";

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
        const contract = new web3.eth.Contract(abi, ADDR);
        console.log('Connect Contract ', contract);
        await props.contract(contract);
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