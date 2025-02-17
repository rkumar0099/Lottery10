import React from 'react'
import {useState, useEffect} from 'react';
import "../style/global.css";
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Slider from './Slider/Slider';
import './Slider/slider.css';
import { LOTTERY_CONTRACT_ADDR } from "../global";


const Draw = (props) => {
    const contract = props.contract;
    const sender = props.sender;
    const web3 = props.web3;
    const [ loading, setLoading ] = useState(false);
    const [drawList, setDrawList] = useState([]);

    useEffect(() => {
        console.log('Initializing the draw list');
        initDrawList();
        
    }, [])

    const initDrawList = async () => {
        var draws = [];
        var i = 1;
        await contract.methods.currentRound().call({from: sender})
        .then(async (res) => {
            for (; i < res; i++) {
                await contract.methods.eligibleDraw(sender, i).call({from: sender})
                .then(async (res) => {
                    if (res) {
                        draws.push(i);
                    }
                })   
            }
        });
        setDrawList(draws);
    }
    
    const handleWinnersClick = async () => {
        if (loading) {
            return;
        }

        await props.backFlag(5);
        await props.flag(4);
    }

    const handleBack = async () => {
        if (loading) {
            return;
        }
        await props.flag(1);
    }

    const handleDraw = async (round) => {
        if (loading) {
            return;
        }
        const {ethereum} = window;
        try {
            setLoading(true);
            const spentGas = await contract.methods.performDraw(sender, round).estimateGas({
                from: sender
            });
            console.log('[Draw] Spent Gas ', spentGas);
            const txParams = {
                from: sender,
                to: LOTTERY_CONTRACT_ADDR,
                data: contract.methods.performDraw(sender, round).encodeABI({
                from: sender,
                gas: spentGas,
                }),
                chainId: '0x4'
            } 
            console.log(ethereum);
            const txHash = await ethereum .request({
                method: 'eth_sendTransaction',
                params: [txParams],
            });

            console.log('The Tx Hash ', txHash);
  
            const interval = setInterval(async function() {
                console.log('Attempt to fetch transaction receipt');
                web3.eth.getTransactionReceipt(txHash, async (err, rec) => {
                    if (rec) {
                        console.log(rec);
                        clearInterval(interval);
                        setLoading(false);
                        return await props.flag(1);
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
        <Slider list={drawList} handler={handleDraw} type={"Draw"} />
        <button className="draw-winner" onClick={handleWinnersClick}>Winners</button>
        <div className="go-back" onClick={handleBack}>Go Back</div>
        <p className="footer">
            &copy;2022 React App. All rights reserved
        </p>
        </div>
    )
}

export default Draw;