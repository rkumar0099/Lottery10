import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"

const Landing = (props) => {
    let sender;
    let contract;
    const [round, setRound] = useState(0);

    useEffect(() => {
        sender = props.sender;
        contract = props.contract;
        console.log('Main Sender ', sender);
        console.log('Main Contract ', contract);
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
        console.log('Asking client to register first');
        await props.flag(2); // ask client to register
        return;
      }
    } 

    return (
        <div className="landing">
          <div className="wrapper">
            <h2 className="header">LOTTERY 10</h2>
          </div>
          <div className="wrapper">
            <button className="btn-register" onClick={handleClickRound}>Round {round}</button>
          </div>
          <div className="wrapper">
            <button className="btn-register" onClick={handleBack}>Go Back</button>
          </div>
          <div className="wrapper">
            <p className="footer">
            &copy;2022 React App. All rights reserved
            </p>
          </div>
        </div>
      );
}

export default Landing