import React, {useState, useRef, useEffect} from 'react';
import "../style/global.css"

const Main = (props) => {
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
                console.log("You have already registered\n");
            } else {
                console.log("Displaying Sign up");
                await props.flag(2);
            }
    }

    const handleSignin = async (e) => {
        const res = await contract.methods.exists(sender).call({from: sender});
        if (!res) {
            e.preventDefault();
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
          <div className="signup">
            <button className="signup" onClick={handleSignup}>Sign up</button>
          </div>
          <div className="signin">
            <button className="signin" onClick={handleSignin}>Sign in</button>
          </div>
          <button className="go-back" onClick={handleBack}>Go Back</button>
          <div>
            <p>
            &copy;2020 Acme Corp. All rights reserved.
            </p>
          </div>

        </div>
      );
}

export default Main