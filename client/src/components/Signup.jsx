import detectEthereumProvider from '@metamask/detect-provider';
import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css";
import { LOTTERY_CONTRACT_ADDR } from "../global";
var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');
const ETH_GWEI = bigInt('1000000000');
const FINAL_AMT = bigInt('1000000000000000');


const lottery_abi = require('../contracts/Lottery.json');
//const LOTTERY_CONTRACT_ADDR = "0x9CD6B3E4888efd9BCFD53E258f6d43A8f65184f2";

const Signup = (props) => {
    const contract = props.contract;
    const sender = props.sender;
    const [name, setName] = useState('');
    const [amt, setAmt] = useState('');
    const [value, setValue] = useState(0.0);
    const [loading, setLoading] = useState(false);

    const handleNameChange = (e) => {
      if (loading) {
          return;
      }
      setName(e.target.value);
      e.persist();
    }

    const handleAmtChange = (e) => {
      if (loading) {
          return;
      }
      const val = e.target.value;
      if (e.target.value == '') {
        setAmt('');
        setValue(0.0);
        return;
      }
      let isNum = /^\d+$/.test(val);
      console.log(isNum);
      if (isNum && val > 0 && val < 11) {
        setAmt(e.target.value);
        setValue(val / 1000);
      } else {
        alert('You must enter amount between 1-10');
      }
      console.log(e.target.value);
    }

    const validate = (e) => {
      let isNum = /^\d+$/.test(amt);
      if (isNum) {
        let val = amt.valueOf();
        if (val < 1 || val > 10) {
          return false;
        }
      }
      console.log('Amt validation ', isNum);
      return isNum;
    }

    const handleSignupSubmit = async (e) => {
      if (loading) {
        return;
      }

      const {ethereum} = window;
      try {
        let res = validate();
        if (!res) {
          e.preventDefault();
          alert('You must enter Integer value between 1-10 for Amount');
          setName('');
          setAmt('');
          return;
        }

        setLoading(true);

        const total_amt = amt * FINAL_AMT;
        const spentGas = await contract.methods
        .addMember(sender, name.toString(), total_amt)
        .estimateGas({
          from: sender,
          value: total_amt,
        });
        console.log('Spent gas ', spentGas);
        const block = await props.web3.eth.getBlock('latest');

        const txParams = {
          from: sender,
          to: LOTTERY_CONTRACT_ADDR,
          data: contract.methods.addMember(sender, name.toString(), total_amt).encodeABI({
            from: sender,
            gas: spentGas,
          }),
          chainId: '0x4',
          value: "0x" + Number(total_amt).toString(16)
        }
        const txHash = await ethereum .request({
          method: 'eth_sendTransaction',
          params: [txParams],
        });

        const interval = setInterval(async function() {
          console.log('Attempt to fetch transaction receipt');
          props.web3.eth.getTransactionReceipt(txHash, async (err, rec) => {
              if (rec) {
                  console.log(rec);
                  clearInterval(interval);
                  setLoading(false);
                  return await props.flag(3);
              }
          });
      }, 1000);

      } catch(err) {
        console.log(err);
        return;
      }
  }
  

    const handleBack = () => {
      if (loading) {
          return;
      }
      props.flag(1);
    }

    const handleWinnersClick = async () => {
      if (loading) {
          return;
      }
      await props.backFlag(2);
      await props.flag(4);
      return;
    }
    

    return (
        <div className="landing">
          <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
          </div>
          <div className="main-content">
            <input 
              className="info-input"
              id="name" 
              type="text" 
              placeholder="Please Enter Your Name Here"
              name="name"
              value={name}
              onChange={handleNameChange}
            />
            <input 
            className="info-input"
            id="amt" 
            type="text"
            placeholder="Please Enter Amount Here"
            name="amt"
            value={amt}
            onChange={handleAmtChange}
            />
            <div className="label-info">You will invest {value} ETH</div>
          </div>
          <button className="submit-btn" onClick={handleSignupSubmit}>Submit</button>
          <div className="go-back" onClick={handleBack}>Go Back</div>
          <p className="footer">
              &copy;2022 React App. All rights reserved
          </p>
        </div>
      );
}

export default Signup;
  