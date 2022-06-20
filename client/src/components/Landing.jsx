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
      const res = await props.contract.methods.exists(props.sender).call({from: props.sender});
      if (res) {
        console.log('Displaying Client Info');
        await props.flag(3); // show client info 
        return;
      } else {
        const num = await props.contract.methods.numPeers().call({
          from: props.sender
        });
        if (num == 10) {
          alert('10 users registered already! Try to register for next round');
          return;
        }
        console.log('Asking client to register first');
        await props.flag(2); // ask client to register
        return;
      }
    } 

    const handleWinnersClick = async () => {
      await props.backFlag(1);
      await props.flag(4);
    }

    return (

        <div className="landing">
          <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
          </div>
          <div className="landing-container">
            <button className="btn-register" onClick={handleClickRound}>Round {round}</button>
            <button className="btn-register" onClick={handleBack}>Go Back</button>
          </div>
        
          <p className="footer">
            &copy;2022 React App. All rights reserved
          </p>
        </div>
        
      );
}

export default Landing