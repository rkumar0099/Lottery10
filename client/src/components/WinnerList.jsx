import React, { useState, useEffect } from 'react';
import '../style/global.css';
import Web3 from 'web3';
const lottery_contract = require('../contracts/Lottery.json');
const LOTTERY_CONTRACT_ADDR = "0xD095b50110eFCA26F7CB8877F4b4bc0DEaecC581";


const WinnerList = (props) => {
    const keys = ["Address", "Round", "Amount"];
    const contract = props.contract;
    const [list, setList] = useState([]);
    const [init, setInit] = useState(false);

    useEffect(async () => {
        if (!init) {
            await contract.methods.currentRound().call()
            .then(async (res) => {
            var winners = [];
            for(var i = 1; i < res; i++) {
                await contract.methods.getWinner(i).call()
                .then(res => {
                    let winner = {
                        "Address": res["addr"],
                        "Round": res["rnd"],
                        "Amount": res["amt"],
                        }
                        winners.push(winner);
                    });
                }
                setList(winners);
                setInit(true);
            });
        }
    });

    const Heading = () => {
        return keys.map(data => {
            return <th key={data}>{data}</th>
        });
    };

    const Data = () => {
        return list.map(winner => {
            return (
                <tr>
                    {
                        keys.map(key => {
                            return <td key={key}>{winner[key]}</td>
                        })
                    }
                </tr>
            )
        });
    }

    return (
        <div className="table">
            <table>
                <tr>
                    <Heading />
                </tr>
                <Data />
            </table>
        </div>
    )
}

export default WinnerList;