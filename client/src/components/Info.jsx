import React, {useState, useRef, useEffect} from 'react';
import '../style/global.css';

const Info = (props) => {
    const [sender, setSender] = useState('');
    const [contract, setContract] = useState({});
    const [round, setRound] = useState(0);
    const [num, setNum] = useState(0);
    const [exists, setExists] = useState(false);

    useEffect(() => {
        setSender(props.sender);
        setContract(props.contract);
        console.log('Info Contract ', contract);
        props.contract.methods.roundCompleted().call({from: props.sender, gas: 1000000}, (err, res) => {
            setRound(res);
        });
        props.contract.methods.numPeers().call({from: props.sender, gas: 1000000}, (err, res) => {
            setNum(res);
        });
        props.contract.methods.exists(props.sender).call({from: props.sender, gas: 1000000}, (err, res) => {
            setExists(res);
        });

    }, []);

    const SubInfo = () => {
        if (exists) {
            return <div>You are Registered</div>
        } else {
            return <div>You are not registered</div>
        }
    }

    const handleBack = () => {
        props.flag(1);
    }

    return (
        <div className="landing">
            <p>Round {round}</p>
            <p>Num {num}</p>
            <SubInfo />
            <div>
            <button className="go-back" onClick={handleBack}>Go Back</button> 
            </div>
        </div>
    )
} 

export default Info;
