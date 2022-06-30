import React from 'react'
import {useState, useEffect} from 'react';
import "../style/global.css";
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slider from './Slider/Slider';
import './Slider/slider.css';
import { LOTTERY_CONTRACT_ADDR } from "../global";

const lottery_abi = require('../contracts/Lottery.json');


const Redeem = (props) => {
    const contract = props.contract;
    const sender = props.sender;
    const web3 = props.web3;
    const { ethereum } = window.ethereum;
    const [ loading, setLoading ] = useState(false);
    const [redeemList, setRedeemList] = useState([]);

    useEffect(() => {
        console.log('Initializing the Redeem List');
        initRedeemList();
    }, []);

    const initRedeemList = async () => {
        var redeems = [];
        var i = 1;
        try {
            await contract.methods.currentRound().call({from: sender})
            .then(async (res) => {
                for (; i < res; i++) {
                    await contract.methods.eligibleRedeem(sender, i).call({from: sender})
                    .then(async (res) => {
                        if (res) {
                            redeems.push(i);
                        }
                    })   
                }
            })
        } catch(err) {
            console.log(err);
        }
        setRedeemList(redeems);
    }
    
    const handleWinnersClick = async () => {
        if (loading) {
            return;
        }

        await props.backFlag(6);
        await props.flag(4);
    }

    const handleBack = async () => {
        if (loading) {
            return;
        }
        await props.flag(1);
    }

    const handleRedeem = async (round) => {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            const spentGas = await contract.methods.redeem(sender, round).estimateGas({
                from: sender
            });

            const txParams = {
                from: sender,
                to: LOTTERY_CONTRACT_ADDR,
                data: contract.methods.redeem(sender, round).encodeABI({
                from: sender,
                gas: spentGas,
                }),
                chainId: '0x4'
            } 
            const txHash = await ethereum .request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });
  
            const interval = setInterval(async function() {
                console.log('Attempt to fetch transaction receipt');
                web3.eth.getTransactionReceipt(txHash, async (err, rec) => {
                    if (rec) {
                        console.log(rec);
                        clearInterval(interval);
                        setLoading(false);
                        return await props.flag(3);
                    }
                });
            }, 1000);
        } catch(err) {
            console.log(err);
            setLoading(false);
            return;
        }
    }

    return (
        <div className="landing">
        <div className="header">
            <div className="app-title">LOTTERY10</div>
        </div>
        <Slider list={redeemList} handler={handleRedeem} type={"Redeem"}/>
        <button className="draw-winner" onClick={handleWinnersClick}>Winners</button>
        <div className="go-back" onClick={handleBack}>Go Back</div>
        <p className="footer">
            &copy;2022 React App. All rights reserved
        </p>
        </div>
    )
}

export default Redeem;