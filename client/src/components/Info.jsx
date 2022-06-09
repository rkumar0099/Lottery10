import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';
import WinnerList from './WinnerList';

var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const Info = (props) => {
    const sender = props.sender;
    const contract = props.contract;
    const [round, setRound] = useState(0);
    const [roundCompleted, setRoundCompleted] = useState(0);
    const [num, setNum] = useState(0);
    const [exists, setExists] = useState(false);
    const [totalAmt, setTotalAmt] = useState(0.0);
    const [winner, setWinner] = useState({
        addr: '',
        amt: 0,
        round: 0,
        decided: false,
    });

    useEffect(() => {
        console.log('Info Contract ', contract);
        contract.methods.roundCompleted().call({from: sender, gas: 1000000}, (err, res) => {
            setRoundCompleted(res);
        });
        contract.methods.currentRound().call({from: sender, gas: 1000000}, (err, res) => {
            setRound(res);
        });
        contract.methods.numPeers().call({from: sender, gas: 1000000}, (err, res) => {
            setNum(res);
        });
        contract.methods.exists(sender).call({from: sender, gas: 1000000}, (err, res) => {
            setExists(res);
        });
        props.amtContract.methods.getAmt().call({from:sender, gas: 1000000}, (err, res) => {
            setTotalAmt(res/ETH_WEI);
        });

        checkWinner()

    }, []);

    const checkWinner = async () => {
        await props.contract.methods.numPeers().call({from: props.sender}).then(async(num) => {
            console.log('Num of Peers registered are: ', num);
            if (num == 10) {
                console.log('Deciding Winner');
                // seed is the winner decided on the front end. Later use chainlink vrf in smart contract
                // to decide the lottery winner
                var seed = Math.floor(Math.random() * 10);
                seed += 1;

                const owner = await props.contract.methods.getOwner().call({from: sender});
                await props.contract.methods.draw(seed).send({from: owner, gas: 1000000});
                await props.contract.methods.getWinner(round)
                .call({from: sender, gas: 1000000})
                .then(async (win) => {
                    console.log('The winner is ', winner);
                    await props.amtContract.methods.transferAmt(win["addr"], 10*ETH_WEI)
                    .send({from: owner, gas: 1000000});
                    setWinner({
                        ...winner,
                        decided: true,
                        addr: win["addr"],
                        amt: win["amt"],
                        round: win["rnd"],
                    });
                });
            }
        });

}

    const SubInfo = () => {
        if (exists) {
            return <div className="info-value">YES</div>
        } else {
            return <div className="info-value">NO</div>
        }
    }

    const handleBack = () => {
        props.flag(1);
    }

    const Redeem = () => {
        if (props.winner.decided) {
            return <div className="info-value">{props.winner.address}</div>
        } else {
            return <div className="info-value">?</div>
        }
    }

    return (
        <div className="landing">
            <div className="header">
                <div className="app-title">LOTTERY10</div>
                <button className="btn-show-winners">Winners</button>
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
