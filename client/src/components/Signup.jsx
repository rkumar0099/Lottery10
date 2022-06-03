import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"

const Signup = (props) => {
    const [sender, setSender] = useState('');
    const [contract, setContract] = useState({});
    const [name, setName] = useState('');
    const [amt, setAmt] = useState(0);

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

    const handleSignupSubmit = async (e) => {
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
          <div className="info-name">
          <label className="name-label" for="name">
            Name
          </label>
          <input 
            className="name-input"
            id="name" 
            type="text" 
            placeholder="Please Enter Your Name Here"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
          </div>
  
          <div className="info-amt">
            <label className="amt-label" for="amt">
            Amount you would like to put in: 
            </label>
            <input className="amt-input"
            id="amt" 
            type="text"
            pattern="[0-9]*"
            placeholder="Please Enter Amount Here"
            name="amt"
            value={amt}
            onChange={handleAmtChange}
            />
          </div>
          <button className="button-submit" onClick={handleSignupSubmit}>Submit</button>
          <button className="go-back" onClick={handleBack}>Go Back</button>
        </div>
      );
}

export default Signup;
  