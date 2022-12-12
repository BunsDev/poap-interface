import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import poapAbi from '../artifacts/contracts/abhipoap.sol/abhipoap.json';

const CONTRACT_ADDRESS = '0xDdb8BF987606E3521394f70DA9162868945B7E98';
export default function Home() {

  const [currentAccount, setCurrentAccount] = useState('');
  const [mintedLink, setMintedLink] = useState('');
  const mintPoapForEvent = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        signer.signMessage("Sign this message to mint your POAP for Pillai Learn Web3 event")
        const signerMint = new ethers.Wallet(process.env.BRAVE_KEY, provider);
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          poapAbi.abi,
          signerMint
        );

        console.log('Going to pop window for gas fee');
        let toMintAddress = await signer.getAddress();
        console.log('Minting poap to address: ' + toMintAddress);
        let deployedtxn = await connectedContract.mintTrutsNFT(toMintAddress, { gasPrice: ethers.utils.parseUnits('200', 'gwei'), gasLimit: 2000000 });

        console.log('Minning the NFT..');
        await deployedtxn.wait();

        console.log(
          `Mined, see transaction: https://polygonscan.com/tx/${deployedtxn.hash
          }`
        );
        alert(`NFT minted, please find your nft in Opensea`);

      } else {
        console.log('Ethereum object does not exist..');
      }
    } catch (error) {
      console.log(error);
    }
  };


  const checkConnectedWallet = async () => {
    const { ethereum } = window;

    const accounts = await ethereum.request({ method: 'eth_accounts' });
    console.log(accounts)
    if (accounts.length !== 0) {
      const account = accounts[0];

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log("The Chain Id is : " + chainId);

      const chainIdPolygon = "0x89";
      if (chainId !== chainIdPolygon) {
        console.log("Check if your metamask is connected to Ethereum Mainnet")
        alert("Please change your metamask to Polygon Mainnet");
      }


      console.log('Authorized account found: ', account);
      return;
    } else {
      console.log('No authorised account found');
    }
  };

  const setupEventListner = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          poapAbi.abi,
          signer
        );

        connectedContract.on('NewNFTMinted', (toAddress, itemId, tokenURI) => {
          console.log('NewNFTMinted itemId', itemId);
          let tokenID = itemId - 1;
          setMintedLink(`https://opensea.io/assets/matic/0xDdb8BF987606E3521394f70DA9162868945B7E98/${tokenID}`) //set link here

        })
        console.log('Setup event listener!');
      } else {
        console.log('Ethereum object does not exist..');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    await window.ethereum.enable()
    if (!ethereum) {
      alert('Get Metamask..!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

    console.log('Connected to: ', accounts[0]);
    setCurrentAccount(accounts[0]);
    setupEventListner();
  };

  useEffect(() => {
    checkConnectedWallet()
  }, [])

  return (
    <div className={styles.home}>
      <img className={styles.bg_desktop} src="./hero_desktop_bg.png" alt="" />
      <img className={styles.bg_mobile} src="./hero_mobile_bg.png" alt="" />
      <img className={styles.logo} src="/logo.svg" alt="" />
      <h1>Henlo Attendendee!</h1>
      <img className={styles.ticket_desktop} src="/ticket.png" alt="" />
      <img className={styles.ticket_mobile} src="/ticket_mobile.png" alt="" />
      <h2>Get a chance to mint this Proof of Attendence NFT</h2>
      <h3>Click on the button below to Connect Wallet, once connected you can Mint.</h3>

      {
        currentAccount ?

          <div className={styles.stylized_btn}>
            <button onClick={mintPoapForEvent}>
              Mint NFT
            </button>
          </div>
          :
          <div className={styles.stylized_btn}>
            <button onClick={connectWallet}>
              Connect Wallet
            </button>
          </div>
      }
      {
        mintedLink &&
        <h4>Check your NFT on Opensea <a className={styles.txGrad} href={mintedLink}>Click Here</a></h4>
      }

      <h4>Don’t have a crypto wallet? <a className={styles.txGrad} href="https://metamask.io/faqs/">Let’s make one!</a></h4>
    </div >
  )
}
