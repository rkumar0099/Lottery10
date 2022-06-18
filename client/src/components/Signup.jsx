import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"
var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const Signup = (props) => {
    const contract = props.contract;
    const amtContract = props.amtContract;
    const sender = props.sender;
    const [name, setName] = useState('');
    const [amt, setAmt] = useState('');
    const [value, setValue] = useState(0.0);
  
    const handleNameChange = (e) => {
      setName(e.target.value);
      e.persist();
    }

    const handleAmtChange = (e) => {
      const val = e.target.value;
      if (e.target.value == '') {
        setAmt('');
        return;
      }
      let isNum = /^\d+$/.test(val);
      console.log(isNum);
      if (isNum && val > 0 && val < 11) {
        setAmt(e.target.value);
        setValue(val / 100);
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
      let res = validate();
      if (!res) {
        e.preventDefault();
        alert('You must enter Integer value between 1-10 for Amount');
        setName('');
        setAmt('');
        return;
      }

      console.log('Signup Contract ', contract);
      await contract.methods.addMember(sender, name.toString(), amt)
      .send({from: sender, gas: 1000000});
      res = await contract.methods.exists(sender).call({from: sender, gas: 1000000});
      if (!res) {
        alert('Sorry, 10 members have already registered. Try to register for next round');
        return;
      }

      await amtContract.methods.addAmt().send({
        from: sender,
        gas: 1000000,
        value: amt * ETH_WEI,
      }).on('Confirmation', (res) => {
        console.log('Amt is added into the contract');
      });

      return checkWinner();
      
  }

    const checkWinner = async () => {
      const num = await contract.methods.numPeers().call({from: sender});
      console.log('Num of Peers registered are: ', num);

      if (num == 10) {
          console.log('Deciding Winner');

          // seed is the winner decided on the front end. Later use chainlink vrf in smart contract
          // to decide the lottery winner

          var seed = Math.floor(Math.random() * 10);
          seed += 1;

          const owner = await contract.methods.getOwner().call({from: sender});
          const round = await contract.methods.currentRound().call({from: sender});

          await contract.methods.draw(seed).send({from: owner, gas: 1000000});
          const winner = await contract.methods.getWinner(round).call({from: sender});
          console.log('Winner is ', winner);
          
          const totalAmt = await amtContract.methods.getAmt().call({from: sender}); 
          await amtContract.methods.transferAmt(winner["addr"], totalAmt)
          .send({from: owner, gas: 1000000});

          await props.winner(true);
          await props.backFlag(0);
          return await props.flag(4);

          } else {
            return await props.flag(3);
          }
    }

    const handleBack = () => {
      props.flag(1);
    }

    const handleWinnersClick = async () => {
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
            <button className="submit-btn" onClick={handleSignupSubmit}>Submit</button>
            <button className="btn-register" onClick={handleBack}>Go Back</button>
          </div>
          <p className="footer">
              &copy;2022 React App. All rights reserved
          </p>
        </div>
      );
}

export default Signup;
  