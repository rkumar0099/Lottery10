import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import "../style/global.css";
import Landing from './Landing';
import Signup from "./Signup";
import Info from "./Info";
import Connect from "./Connect";
import WinnerList from './WinnerList';
import Draw from './Draw';
import Redeem from './Redeem';
import { LOTTERY_CONTRACT_ADDR, lottery_abi } from "../global.js";
import { web3Modal } from '../web3Modal';

const Main = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43eb312dce2340dc859b09a8a06c8e21"));
  const contract = new web3.eth.Contract(lottery_abi.abi, LOTTERY_CONTRACT_ADDR);
  const [sender, setSender] = useState('');
  const [flag, setFlag] = useState(0);
  const [backFlag, setBackFlag] = useState(0);
  const [provider, setProvider] = useState();
  const [library, setLibrary] = useState();


  const handleBack = () => {
    setFlag(0);
  }


    if (flag == 0) {
      return <Connect 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={setSender} contract={contract} />

    } else if (flag == 1) {

      return <Landing 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} />

    } else if (flag == 2) {

      return <Signup 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} />

    } else if (flag == 3) {

        return <Info 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} />

    } else if (flag == 4) {

        return <WinnerList 
        flag={setFlag} backFlag={backFlag} web3={web3}
        contract={contract} sender={sender} />

    } else if (flag == 5) {
        return <Draw 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} />

    } else if (flag == 6) {

        return <Redeem 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} />

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