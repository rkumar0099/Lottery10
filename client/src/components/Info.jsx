import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';
var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const Info = (props) => {
    const [sender, setSender] = useState('');
    const [contract, setContract] = useState({});
    const [round, setRound] = useState(0);
    const [roundCompleted, setRoundCompleted] = useState(0);
    const [num, setNum] = useState(0);
    const [exists, setExists] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0.0);

    useEffect(() => {
        setSender(props.sender);
        setContract(props.contract);
        console.log('Info Contract ', contract);
        props.contract.methods.roundCompleted().call({from: props.sender, gas: 1000000}, (err, res) => {
            setRoundCompleted(res);
        });
        props.contract.methods.currentRound().call({from: props.sender, gas: 1000000}, (err, res) => {
            setRound(res);
        });
        props.contract.methods.numPeers().call({from: props.sender, gas: 1000000}, (err, res) => {
            setNum(res);
        });
        props.contract.methods.exists(props.sender).call({from: props.sender, gas: 1000000}, (err, res) => {
            setExists(res);
        });
        props.amtContract.methods.getAmt().call({from:props.sender, gas: 1000000}, (err, res) => {
            setTotalAmt(res/ETH_WEI);
        });

    }, []);

    const SubInfo = () => {
        if (exists) {
            return <p className="general-info">You are Registered</p>
        } else {
            return <p className="general-info">You are not registered</p>
        }
    }

    const handleBack = () => {
        props.flag(1);
    }

    return (
        <div className="landing">
            <div className="wrapper">
                <p className="general-info">Current Round: {round}</p>
            </div>
            <div className="wrapper">
                <p className="general-info">Num Peers Registered: {num}</p>
            </div>
            <div className="wrapper">
                <p className="general-info">Rounds Completed: {roundCompleted}</p>
            </div>
            <div className="wrapper">
                <SubInfo />
            </div>
            <div className="wrapper">
                <p className="general-info">Total Lottery Amt For This Round: {totalAmt} ETH</p>
            </div>
            <div className="wrapper">
                <button className="go-back" onClick={handleBack}>Go Back</button>
            </div>
            <div className="wrapper">
                <p className="footer">
                &copy;2022 React App. All rights reserved
                </p>
            </div>

        </div>
    )
} 

export default Info;
