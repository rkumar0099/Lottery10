import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css";

const Landing = (props) => {
    const contract = props.contract;
    const sender = props.sender;
    const [round, setRound] = useState(0);

    useEffect(() => {
        contract.methods.currentRound().call({
          from: sender,
        }).then(res => {
          setRound(res);
        })
    }, []);

    const handleBack = () => {
        props.flag(0);
    }

    const handleClickRound = async () => {
      const rnd = await contract.methods.currentRound().call({from: sender});
      console.log(rnd);
      const res = await contract.methods.exists(sender, rnd).call({from: sender});
      if (res) {
        console.log('Displaying Client Info');
        await props.flag(3); // show client info 
        return;
      }
        console.log('Asking client to register first');
        await props.flag(2); // ask client to register
        return;
    } 

    const handleWinnersClick = async () => {
      await props.backFlag(1);
      await props.flag(4);
    }

    const handleDraw = async() => {
      await props.backFlag(1);
      await props.flag(5);
    }

    const handleRedeem = async() => {
      await props.backFlag(1);
      await props.flag(6);
    }



    return (
        <div className="landing">
          <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
          </div>
          <div className="landing-container">
            <button className="btn-register" onClick={handleClickRound}>Round {round}</button>
            <button className="btn-register" onClick={handleDraw}>Draws</button>
            <button className="btn-register" onClick={handleRedeem}>Redeem</button>
          </div>
          <div className="go-back" onClick={handleBack}>Go Back</div>
          <p className="footer">
            &copy;2022 React App. All rights reserved
          </p>
        </div>
        
    );
}

export default Landing