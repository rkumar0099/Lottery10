import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';
import { LOTTERY_CONTRACT_ADDR, ETH_WEI } from "../global";

const Info = (props) => {
    const { ethereum } = window;
    const sender = props.sender;
    const contract = props.contract;
    const [round, setRound] = useState(0);
    const [roundCompleted, setRoundCompleted] = useState(0);
    const [num, setNum] = useState(0);
    const [exists, setExists] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0.0);
    const [loading, setLoading] = useState(false);

    useEffect(async () => {
        console.log('Info Contract ', contract);
        const rnd = await contract.methods.currentRound().call({from: sender});
        console.log(rnd);
        contract.methods.roundCompleted().call({gas: 1000000}, (err, res) => {
            setRoundCompleted(res);
        });
        contract.methods.currentRound().call({gas: 1000000}, (err, res) => {
            setRound(res);
        });
        contract.methods.numPeers(rnd).call({ gas: 1000000}, (err, res) => {
            setNum(res);
        });
        contract.methods.exists(sender, rnd).call({gas: 1000000}, (err, res) => {
            setExists(res);
        });
        // modify contract to get balance for the round instead of a contract
        contract.methods.getBalance().call({gas: 1000000}, (err, res) => {
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
        if (loading) {
            return;
        }
        await props.flag(1);
    }

    const Redeem = () => {
       
        return <div className="info-value">?</div>
        
    }

    const handleWinnersClick = async() => {
        if (loading) {
            return;
        }
        await props.backFlag(3);
        return await props.flag(4);
    }

    const handleWithdraw = async() => {
        if (loading) {
            return;
        }

        try {

            setLoading(true);

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
                        setLoading(false);
                        return await props.flag(1);
                    }
                });
            }, 1000);

        } catch(err) {
            console.log(err);
            setLoading(false);
        }
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
            <div className="go-back" onClick={handleBack}>Go Back</div>
            <p className="footer">
                &copy;2022 React App. All rights reserved
            </p>
        </div>
    );
} 

export default Info;
