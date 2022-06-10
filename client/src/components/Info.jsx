import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';
import WinnerList from './WinnerList';

var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const Info = (props) => {
    const sender = props.sender;
    const contract = props.contract;
    const amtContract = props.amtContract;
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
        amtContract.methods.getAmt().call({gas: 1000000}, (err, res) => {
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
            <button className="go-back" onClick={handleBack}>Go Back</button>
            <p className="footer">
                &copy;2022 React App. All rights reserved
            </p>
        </div>
    );
} 

export default Info;
