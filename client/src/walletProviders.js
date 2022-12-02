import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";

const providerOptions = {
    coinbase: {
        package: CoinbaseWalletSDK,
        options: {
            infuraId: "43eb312dce2340dc859b09a8a06c8e21",
        }
    },
    connectWallet: {
        packagE: WalletConnect,
        options: {
            infuraId: "43eb312dce2340dc859b09a8a06c8e21",
        }
    }
};

export const web3Modal = new Web3Modal({
    providerOptions // required
});

const options = {
    infuraId: "43eb312dce2340dc859b09a8a06c8e21",
}

export const wcProvider = new WalletConnectProvider(options);

// Subscribe to accounts change
wcProvider.on("accountsChanged", (accounts) => {
    console.log(accounts);
  });
  
  // Subscribe to chainId change
  wcProvider.on("chainChanged", (chainId) => {
    console.log(chainId);
  });
  
  // Subscribe to session disconnection
  wcProvider.on("disconnect", (code, reason) => {
    console.log(code, reason);
  });