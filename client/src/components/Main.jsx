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
import { LOTTERY_CONTRACT_ADDR } from "../global.js";

const lottery_abi = require('../contracts/Lottery.json');

const Main = () => {
  const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/43eb312dce2340dc859b09a8a06c8e21"));
  const contract = new web3.eth.Contract(lottery_abi.abi, LOTTERY_CONTRACT_ADDR);
  const [sender, setSender] = useState('');
  const [flag, setFlag] = useState(0);
  const [backFlag, setBackFlag] = useState(0);
  const [winnerList, setWinnerList] = useState([]);
  const [drawList, setDrawList] = useState([]);
  const [redeemList, setRedeemList] = useState([]);
  const [update, setUpdate] = useState(false);

  /*
  const initWinnerList = () => {
      contract.methods.currentRound().call()
      .then(async (res) => {
      var winners = [];
      var i = 1;
      for(i = 1; i < res; i++) {
        let winner = {};
        winner["Round"] = i;
        contract.methods.drawCompleted(i).call({from: sender})
        .then(res => {
          if(res) {
            winner["Draw"] = "completed";
            contract.methods.getWinner(i).call({from: sender})
            .then(res => {
              winner["Address"] = res["addr"];
              winner["Amount"] = res["amt"];
            });
            contract.methods.redeemCompleted(i).call({from: sender})
            .then(res => {
              if (res) {
                winner["Status"] = "completed";
                winner["Redeem"] = "Redeemed";
              } else {
                winner["Redeem"] = "-";
                winner["Status"] = "in-progress";
              }
            })
          } else {
            winner["Draw"] = "in-progress";
            winner["Winner"] = "-";
            winner["Addr"] = "-";
            winner["Amount"] = "-";
            winner["Redeem"] = "-";
            winner["Status"] = "in-progress";
          }
        })
        console.log('[Winner Init] winner is ', winner);
        winners.push(winner);
        }
          setWinnerList(winners);
      });
  }
  */
  /*
  const initDrawAndRedeemList = () => {
    contract.methods.currentRound().call({from: sender})
    .then((res) => {
      var draws = [];
      var redeems = [];
      var i = 1;
      for (; i < res; i++) {
        console.log('[DrawRedeem] Round ' + i);
        contract.methods.eligibleDraw(sender, i).call({from: sender})
        .then(res => {
          if (res) {
            draws.push(i);
          }
        })
        contract.methods.eligibleRedeem(sender, i).call({from: sender})
        .then(res => {
          if (res) {
            redeems.push(i);
          }
        });
        /*
        contract.methods.drawCompleted(i).call({from: sender})
        .then(res => {
          if (!res) {
            console.log('The draw is not yet completed');
            contract.methods.numPeers(i).call({from: sender})
            .then(res => {
              console.log('Number of peers registered for round ' + i + ' are ' + res);
              if (res == 10) {
                console.log('Number of peers registered for round ' + i + ' are ' + res);
                contract.methods.exists(sender, i).call({from: sender})
                .then(res => {
                  if (res) {
                    // draw not completed, num of peers registered for that round are 10, this member
                    // is registered for that round, allow him to perform the draw
                    console.log("eligible draw");
                    draws.push(i);
                  }
                })
              }
            })
          } else {
            contract.methods.redeemCompleted(i).call({from: sender})
            .then(res => {
              if (!res) {
                redeems.push(i);
              }
            })
          }
        })
        
      }
      console.log('Number of draws ' + drawList.length);
      console.log('Number of redeems ', redeems.length);
      //setDrawList(draws);
      setRedeemList(redeems);
    });
  }
  */

  const handleBack = () => {
    setFlag(0);
  }


    if (flag == 0) {

      console.log('Flag = 0. Sender: ', sender);
      return <Connect 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={setSender} contract={contract} update={setUpdate} />

    } else if (flag == 1) {
      console.log('Flag 1: ', contract);
      return <Landing 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} />

    } else if (flag == 2) {
      console.log('Flag = 2. Sender: ', sender);
      return <Signup 
      flag={setFlag} backFlag={setBackFlag} web3={web3}
      sender={sender} contract={contract} />

    } else if (flag == 3) {
        return <Info 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} />

    } 
    
      else if (flag == 4) {
        return <WinnerList flag={setFlag} backFlag={backFlag} web3={web3}
        winnerList={winnerList} contract={contract} sender={sender} />

    } 
      else if (flag == 5) {
        return <Draw 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} drawList={drawList} />

    } 
      else if (flag == 6) {
        return <Redeem 
        flag={setFlag} backFlag={setBackFlag} web3={web3}
        sender={sender} contract={contract} redeemList={redeemList} />
    }
    
    else {
      return (
        <div className="landing">
          <text className="error"> Error </text>
          <button className="go-back" onClick={handleBack}>Go Back</button>
        </div>
      )
    }

}

export default Main;