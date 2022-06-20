import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';

var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const lottery_abi = require('../contracts/Lottery.json');
const LOTTERY_CONTRACT_ADDR = "0x31C65D465d605A4A7dc7B4008dE791F28CE523ea";

const Info = (props) => {
    const { ethereum } = window;
    const sender = props.sender;
    const contract = props.contract;
    const [round, setRound] = useState(0);
    const [roundCompleted, setRoundCompleted] = useState(0);
    const [num, setNum] = useState(0);
    const [exists, setExists] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0.0);

    useEffect(() => {
        console.log('Info Contract ', contract);
        contract.methods.roundCompleted().call({gas: 1000000}, (err, res) => {
            setRoundCompleted(res);
        });
        contract.methods.currentRound().call({gas: 1000000}, (err, res) => {
            setRound(res);
        });
        contract.methods.numPeers().call({ gas: 1000000}, (err, res) => {
            setNum(res);
        });
        contract.methods.exists(sender).call({gas: 1000000}, (err, res) => {
            setExists(res);
        });
        contract.methods.totalFunds().call({gas: 1000000}, (err, res) => {
            setTotalAmt(res/ETH_WEI);
        });

    }, []);

    const SubInfo = () => {
        if (exists) {
            return <div className="info-value">YES</div>
        } else {
            return <div className="info-value">NO</div>
        }
    }

    const handleBack = async () => {
        await props.flag(1);
    }

    const Redeem = () => {
       
        return <div className="info-value">?</div>
        
    }

    const handleWinnersClick = async() => {
        await props.backFlag(3);
        return await props.flag(4);
    }

    const handleWithdraw = async() => {
        const spentGas = await contract.methods
        .withdraw(sender)
        .estimateGas({
          from: sender
        });
        console.log('Spent gas ', spentGas);

        const txParams = {
            from: sender,
            to: LOTTERY_CONTRACT_ADDR,
            data: contract.methods.withdraw(sender).encodeABI({
              from: sender,
              gas: spentGas,
            }),
            chainId: '0x4',
        }
        const txHash = await ethereum .request({
            method: 'eth_sendTransaction',
            params: [txParams],
        });
        const interval = setInterval(async function() {
            console.log('Attempt to fetch transaction receipt');
            props.web3.eth.getTransactionReceipt(txHash, async (err, rec) => {
                if (rec) {
                    console.log(rec);
                    clearInterval(interval);
                    return await props.flag(1);
                }
            });
        }, 1000);
    }

    return (
        <div className="landing">
            <div className="header">
                <div className="app-title">LOTTERY10</div>
                <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
            </div>
            <div className="info-container">
            <div className="general-info">
                <div className="info-label">Current Round</div>
                <div className="info-value">{round}</div>
            </div>
            <div className="general-info">
                <div className="info-label">Registered Users</div>
                <div className="info-value">{num}</div>
            </div>
            <div className="general-info">
                <div className="info-label">Registered?</div>
                <SubInfo />
            </div>
            <div className="general-info">
                <div className="info-label">Amount Invested</div>
                <div className="info-value">{totalAmt} ETH</div>
            </div>
            <div className="general-info">
                <div className="info-label">Winner</div>
                <Redeem />
            </div>
            <div className="general-info">
                <div className="info-label">Rounds Completed</div>
                <div className="info-value">{roundCompleted}</div>
            </div>
            </div>
            
            <button className="btn-withdraw" onClick={handleWithdraw}>Withdraw</button>
            <button className="go-back" onClick={handleBack}>Go Back</button>
            <p className="footer">
                &copy;2022 React App. All rights reserved
            </p>
        </div>
    );
} 

export default Info;
