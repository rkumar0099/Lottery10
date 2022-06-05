import React, { useState, useEffect } from 'react';
import "../style/global.css"
import Landing from './Landing';
import Signup from "./Signup";
import Info from "./Info";
import Connect from "./Connect";

const Main = () => {
  const [flag, setFlag] = useState(0);
  const [sender, setSender] = useState('');
  const [contract, setContract] = useState({});
  const [amtContract, setAmtContract] = useState({});
  const [values, setValues] = useState({
    round: 0,
    num: 0,
    exists: false,
  });

  const handleBack = () => {
    setFlag(0);
  }


    if (flag == 0) {
      console.log('Flag = 0. Sender: ', sender);
      return <Connect 
      flag={setFlag} sender={setSender} contract={setContract} contractAmt={setAmtContract}
      />
    } else if (flag == 1) {
      console.log('Flag 1: ', contract, amtContract);
      return <Landing flag={setFlag} sender={sender} contract={contract} />
    } else if (flag == 2) {
      console.log('Flag = 2. Sender: ', sender);
      return <Signup 
      flag={setFlag} sender={sender} contract={contract} amtContract={amtContract}
      />
    } else if (flag == 3) {
        return <Info 
        flag={setFlag} sender={sender} contract={contract} amtContract={amtContract}
        />

    } else {
      return (
        <div className="landing">
          <text className="error"> Error </text>
          <button className="go-back" onClick={handleBack}>Go Back</button>
        </div>
      )
    }
}

export default Main;