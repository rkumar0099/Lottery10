import React, { useState, useEffect } from 'react';
import "../style/global.css"
import Main from './Main';
import Signup from "./Signup";
import Info from "./Info";
import Connect from "./Connect";

const Form = () => {
  const [flag, setFlag] = useState(0);
  const [sender, setSender] = useState('');
  const [contract, setContract] = useState({});
  const [values, setValues] = useState({
    round: 0,
    num: 0,
    exists: false,
  });


    if (flag == 0) {
      console.log('Flag = 0. Sender: ', sender);
      return <Connect flag={setFlag} sender={setSender} contract={setContract} />
    } else if (flag == 1) {
      console.log('Flag = 1. Sender: ', sender);
      return <Main flag={setFlag} sender={sender} contract={contract} />
    } else if (flag == 2) {
      console.log('Flag = 2. Sender: ', sender);
      return <Signup flag={setFlag} sender={sender} contract={contract} />
    } else if (flag == 3) {
        return <Info flag={setFlag} sender={sender} contract={contract} />

    } else {
      return (
        <div className="landing">
          <text className="error"> Error </text>
        </div>
      )
    }
}

export default Form;