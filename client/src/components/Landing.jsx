import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"

const Landing = (props) => {
    let sender;
    let contract;

    useEffect(() => {
        sender = props.sender;
        contract = props.contract;
        console.log('Main Sender ', sender);
        console.log('Main Contract ', contract);

    }, []);

    const handleSignup = async (e) => {

      const res = await contract.methods.exists(sender).call({from: sender});
  
      if (res) {
        e.preventDefault();
        alert('You have already registered');
        return;
      } else {
        console.log("Displaying Sign up");
        await props.flag(2);
      }

    }

    const handleSignin = async (e) => {
  
    const res = await contract.methods.exists(sender).call({from: sender});
  
    if (!res) {
          e.preventDefault();
          alert('You must register first');
          console.log('You must register first');
      } else {
            console.log('Displaying Info');
            await props.flag(3);
      }
    }

    const handleBack = () => {
        props.flag(0);
    }

    return (
        <div className="landing">
          <div className="wrapper">
            <h2 className="header">LOTTERY 10</h2>
          </div>
          <div className="wrapper">
            <button className="btn-register" onClick={handleSignup}>Sign up</button>
          </div>
          <div className="wrapper">
            <button className="btn-register" onClick={handleSignin}>Sign in</button>
          </div>
          <div className="wrapper">
            <button className="btn-register" onClick={handleBack}>Go Back</button>
          </div>
          <div className="wrapper">
            <p className="footer">
            &copy;2022 React App. All rights reserved
            </p>
          </div>
        </div>
      );
}

export default Landing