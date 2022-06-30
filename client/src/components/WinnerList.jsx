import React from 'react';
import { useState, useEffect } from 'react';
import '../style/global.css';


const WinnerList = (props) => {
    const keys = ["Round", "Status", "Draw", "Redeem", "Winner", "Amount"];
    const contract = props.contract;
    const sender = props.sender;
    const list = props.winnerList;
    const [winnerList, setWinnerList] = useState([]);

    useEffect(() => {
        console.log("Initializing the winner list");
        initWinnerList();
    }, []);

    const initWinnerList = async () => {
        var winners = [];
        var i = 1;
        await contract.methods.currentRound().call()
        .then(async (res) => {
        for(i = 1; i < res; i++) {
          let winner = {};
          winner["Round"] = i;
          await contract.methods.drawCompleted(i).call({from: sender})
          .then(async (res) => {
            if(res) {
              winner["Draw"] = "completed";
              await contract.methods.getWinner(i).call({from: sender})
              .then(async (res) => {
                winner["Winner"] = res["addr"];
                winner["Amount"] = res["amt"];
              });
              await contract.methods.redeemCompleted(i).call({from: sender})
              .then(async (res) => {
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
        });
        console.log("Winner length ", winners.length);
        setWinnerList(winners);
    }
  

    const Heading = () => {
        return keys.map(data => {
            return <th className="col-heading">{data}</th>
        });
    };

    const Data = () => {      
        console.log('Number of winners ', winnerList.length);

        return winnerList.map((value, index) => {
            return (
                <tr>
                    {
                        keys.map(key => {
                            return <td className="col-data">{value[key]}</td>
                        })
                    }
                </tr>
            )
        })
    }

    const handleBack = async () => {
        await props.flag(props.backFlag);
    }

    const handleWinnersClick = async (e) => {
        e.preventDefault();
    }

    return (
        <div className="landing">
        <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
        </div>
        <div className="table-container">
            <div className="table">
                <table>
                    <tr>
                        <Heading />
                    </tr>
                    <Data />
                </table>
            </div>
            <div className="go-back" onClick={handleBack}>Go Back</div>
        </div>
        <p className="footer">
            &copy;2022 React App. All rights reserved
        </p>
        </div>
    )
}

export default WinnerList;
