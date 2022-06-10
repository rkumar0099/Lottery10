import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import "../style/global.css";
import Landing from './Landing';
import Signup from "./Signup";
import Info from "./Info";
import Connect from "./Connect";
import WinnerList from './WinnerList';


const lottery_contract = require('../contracts/Lottery.json');
const amt_collector_contract = require('../contracts/AmtCollector.json');
const LOTTERY_CONTRACT_ADDR = "0xD095b50110eFCA26F7CB8877F4b4bc0DEaecC581";
const AC_CONTRACT_ADDR = "0x983c46d807FB0e0d7c718f32bfAa8E835E873930";


const Main = () => {
  const { ethereum } = window;
  const web3 = new Web3(ethereum.provider || "http://127.0.0.1:8545");
  const contract = new web3.eth.Contract(lottery_contract.abi, LOTTERY_CONTRACT_ADDR);
  const amtContract = new web3.eth.Contract(amt_collector_contract.abi, AC_CONTRACT_ADDR);
  const [sender, setSender] = useState('');
  const [flag, setFlag] = useState(0);
  const [backFlag, setBackFlag] = useState(0);
  const [winner, setWinner] = useState(false);
  const [winnerList, setWinnerList] = useState([]);

  useEffect(() => {
      console.log(contract, amtContract);
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
      flag={setFlag} backFlag={setBackFlag}
      sender={setSender} contract={contract} amtContract={amtContract} />

    } else if (flag == 1) {

      console.log('Flag 1: ', contract, amtContract);
      return <Landing 
      flag={setFlag} backFlag={setBackFlag} 
      sender={sender} contract={contract} amtContract={amtContract} />

    } else if (flag == 2) {

      console.log('Flag = 2. Sender: ', sender);
      return <Signup 
      flag={setFlag} backFlag={setBackFlag}
      sender={sender} contract={contract} amtContract={amtContract} winner={setWinner} />

    } else if (flag == 3) {

        return <Info 
        flag={setFlag} backFlag={setBackFlag} 
        sender={sender} contract={contract} amtContract={amtContract} winner={winner} />

    } else if (flag == 4) {

      return <WinnerList flag={setFlag} backFlag={backFlag} winners={winnerList}
      contract={contract} amtContract={amtContract} />

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