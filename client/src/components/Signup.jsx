import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"
var bigInt = require('big-integer');
const ETH_WEI = bigInt('1000000000000000000');

const Signup = (props) => {
    const [sender, setSender] = useState('');
    const [contract, setContract] = useState({});
    const [name, setName] = useState('');
    const [amt, setAmt] = useState('');
    //const [num, setNum] = useState(0);

    useEffect(()=>{
        setSender(props.sender);
        setContract(props.contract);
    }, []);
  
    const handleNameChange = (e) => {
      setName(e.target.value);
      e.persist();
    }

    const handleAmtChange = (e) => {
      setAmt(e.target.value);
      e.persist();
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
      await contract.methods.addMember(sender, name.toString(), amt).send({from: sender, gas: 1000000});
      res = await contract.methods.exists(sender).call({from: sender, gas: 1000000});
      if (!res) {
        alert('Sorry, 10 members have already registered. Try to register for next round');
        return;
      }

      await props.amtContract.methods.addAmt().send({
        from: sender,
        gas: 1000000,
        value: amt * ETH_WEI,
      }).on('Confirmation', (res) => {
        console.log('Amt is added into the contract');
      });
      await props.flag(3);
      
    }

    const handleBack = () => {
      props.flag(1);
    }
    

    return (
        <div className="landing">
          <div className="header">
            <div className="app-title">LOTTERY10</div>
            <button className="btn-show-winners">Winners</button>
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
  