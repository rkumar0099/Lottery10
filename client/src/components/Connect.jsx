import React, {useEffect, useState} from 'react';
import "../style/global.css";
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import WalletConnectProvider from "@walletconnect/web3-provider";



    const infura_key = '43eb312dce2340dc859b09a8a06c8e21';
    const main_chain = `https://mainnet.infura.io/v3/${infura_key}`;
    const goerli_chain = `https://goerli.infura.io/v3/${infura_key}`;

    const provider_mainnet = 'https://mainnet.infura.io/v3/800054c370de4aa7907af5b45273c7fd';
    const provider_goerli = 'https://goerli.infura.io/v3/800054c370de4aa7907af5b45273c7fd';

    console.log(goerli_chain);

export const getWalletConnectProvider = async () => {
  const provider = new WalletConnectProvider({
    infuraId: infura_key,
    rpc: {
      1: provider_mainnet,
      5: provider_goerli,
    },
    chainId: 1,
    qrcodeModal: QRCodeModal,
    qrcodeModalOptions: {
      mobileLinks: ['metamask', 'coinbase', 'trust'],
    },
  });

  provider.on("accountsChanged", (accounts) => {
    console.log(accounts);
  });
  
  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });
  
  // Subscribe to session disconnection
  provider.on("disconnect", (code, reason) => {
    console.log(code, reason);
  });

  provider.on("connect", (accounts) => {
    console.log("WalletConnect connected successfully ", accounts);
  });

  await provider.enable();

  return provider;
}


const Connect = (props) => {
    const [loading, setLoading] = useState(false)

    const walletConnect = async () => {
        try {
            console.log("Connecting ...");
            const wcProvider = await getWalletConnectProvider();

            //wcProvider.request({method: 'eth_requestAccounts'}).then(async accounts => {
              //console.log('Account connected is ', accounts[0]);
            //});
            const web3 = new Web3(wcProvider);
            web3.eth.getAccounts().then(accounts => {
              console.log("Account connected is ", accounts[0]);
            });
            console.log("[Wallet Connect] ");
            
        } catch (e) {
            console.log(e);
        }
            setLoading(false);
            return await props.flag(1);        
    }

    const handleClick = async (e) => {

        if (!loading) {
            await walletConnect();
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