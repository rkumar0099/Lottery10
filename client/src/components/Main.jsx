import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import "../style/global.css";
import Landing from './Landing';
import Signup from "./Signup";
import Info from "./Info";
import Connect from "./Connect";
import WinnerList from './WinnerList';

const lottery_abi = require('../contracts/Lottery.json');
const LOTTERY_CONTRACT_ADDR = "0x31C65D465d605A4A7dc7B4008dE791F28CE523ea";

const Main = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43eb312dce2340dc859b09a8a06c8e21"));
  const contract = new web3.eth.Contract(lottery_abi.abi, LOTTERY_CONTRACT_ADDR);
  const [sender, setSender] = useState('');
  const [flag, setFlag] = useState(0);
  const [backFlag, setBackFlag] = useState(0);
  const [winner, setWinner] = useState(false);
  const [winnerList, setWinnerList] = useState([]);

  useEffect(() => {
      console.log(contract);
      initWinnerList();

  }, [winner]);


  const initWinnerList = () => {
      contract.methods.currentRound().call()
      .then(async (res) => {
      var winners = [];
      for(var i = 1; i < res; i++) {
          contract.methods.getWinner(i).call()
          .then(res => {
              let winner = {
                  "Address": res["addr"],
                  "Round": res["rnd"],
                  "Amount": res["amt"],
                  }
                  winners.push(winner);
              });
          }
          setWinnerList(winners);
          //setWinner(false);
      });
  }

  const handleBack = () => {
    setFlag(0);
  }


    if (flag == 0) {

      console.log('Flag = 0. Sender: ', sender);
      return <Connect 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={setSender} contract={contract} />

    } else if (flag == 1) {

      console.log('Flag 1: ', contract);
      return <Landing 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} />

    } else if (flag == 2) {

      console.log('Flag = 2. Sender: ', sender);
      return <Signup 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} winner={setWinner} />

    } else if (flag == 3) {

        return <Info 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} winner={winner} />

    } else if (flag == 4) {

      return <WinnerList flag={setFlag} backFlag={backFlag} web3={web3}
      winners={winnerList} contract={contract} />

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