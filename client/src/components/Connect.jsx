import React, {useState} from 'react';
import Web3 from 'web3';
import "../style/global.css";
import {abi} from '../contracts/Lottery.json';
const ADDR = "0x61baDd224c49D59225c8579DEa71df41C88E76Cb";

const Connect = (props) => {

    const handleClick = async () => {
        const {ethereum} = window;

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

    return (
        <div className="landing">
            <button className="connect-btn" onClick={handleClick}>
                Connect To Wallet
            </button>
        </div>
    );
}

export default Connect;