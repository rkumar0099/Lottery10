import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"

const Signup = (props) => {
    const [sender, setSender] = useState('');
    const [contract, setContract] = useState({});
    const [name, setName] = useState('');
    const [amt, setAmt] = useState('');

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
      await contract.methods.addMember(sender, name.toString(), amt).send({from: sender, gas: 1000000})
      .on('confirmation', (res) => {
          console.log("You have successfully registered");
      });
      await props.flag(3)
    }

    const handleBack = () => {
      props.flag(1);
    }
    

    return (
        <div className="landing">
          <div className="wrapper">
            <h2 className="header">LOTTERY10</h2>
          </div>
          <div className="wrapper">
          <input 
            className="info-input"
            id="name" 
            type="text" 
            placeholder="Please Enter Your Name Here"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          </div>
  
          <div className="wrapper">
            <input 
            className="info-input"
            id="amt" 
            type="text"
            placeholder="Please Enter Amount Here"
            name="amt"
            value={amt}
            onChange={handleAmtChange}
            />
          </div>

          <div className="wrapper">
            <button className="submit-btn" onClick={handleSignupSubmit}>Submit</button>
          </div>

          <div className="wrapper">
            <button className="go-back" onClick={handleBack}>Go Back</button>
          </div>

          <div className="wrapper">
            <p className="footer">
            &copy;2022 React App. All rights reserved
            </p>
          </div>

        </div>
      );
}

export default Signup;
  