import React, {useEffect, useState} from 'react';
import "../style/global.css";
import detectEthereumProvider from '@metamask/detect-provider';


const Connect = (props) => {
    const [processing, setProcessing] = useState(false);
    const [loading, setLoading] = useState(false);
    const {ethereum} = window;

    const walletConnect = async () => {
        if (!loading) {
            setLoading(true);

            const provider = await detectEthereumProvider();
            if (!provider) {
                alert('Please install Metamask extension!');
                setLoading(false);
                return;
            }
            if (provider !== window.ethereum) {
                alert('Wallets mismatch!');
                setLoading(false);
                return;
            }

            try {

                const chainId = await ethereum.request({method: 'eth_chainId'});
                console.log(chainId);
                if (chainId !== "0x4") {
                    alert('You must connect to rinkeby test network!!');
                    return;
                }
            
                const accounts = await ethereum.request({method: 'eth_requestAccounts'});
                console.log("Account addr: ", accounts[0]);
                props.sender(accounts[0]);
                props.update(true);
            }
    
            catch(err) {
                console.log('Error connecting to wallet')
                console.log('Connecting again');
                walletConnect();
            }
        }
        setLoading(false);
        return await props.flag(1);
        
    }

    const handleClick = async (e) => {

        if (!loading) {
            walletConnect();
        } else {
            e.preventDefault();
        }
        return;   
    }

    const handleWinnersClick = async () => {
        await props.backFlag(0);
        await props.flag(4);
        return;
    }


    return (
        <div className="landing">
            <div className="header">
                <div className="app-title">LOTTERY10</div>
                <button className="btn-show-winners" onClick={handleWinnersClick}>Winners</button>
            </div>
                <button className="btn-connect" onClick={handleClick}>
                    CONNECT TO WALLET
                </button>
            <p className="footer">
                &copy;2022 React App. All rights reserved
            </p>
        </div>
    );
}

export default Connect;