import './App.css';
import { useState, useRef, useEffect } from 'react';
import { ethers } from 'ethers';
import MyToken from './artifacts/contracts/MyToken.sol/MyToken.json';
import { Input, Button, Menu, Grid, Divider } from 'semantic-ui-react';

// Update with the contract address logged out to the CLI when it was deployed 
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [supply, setSupply] = useState("");
  const [symbol, setSymbol] = useState("");
  const [paused, setPaused] = useState();
  const [name, setName] = useState();
  const [minter, setMinter] = useState();
  const [pauser, setPauser] = useState();
  const [userBalance, setUserBalance] = useState();
  const [mintTargetAddress, setMintTargetAddress] = useState();
  const [mintAmount, setMintAmount] = useState();
  const [burnTargetAddress, setBurnTargetAddress] = useState();
  const [burnAmount, setBurnAmount] = useState();
  const [connected, setConnected] = useState("Connect Wallet");
  const [transferTargetAddress, setTransferTargetAddress] = useState();
  const [transferAmount, setTransferAmount] = useState();


  const setProvider = () => {
    return new ethers.providers.Web3Provider(window.ethereum);
  }

  const setContract = (data) => {
    return new ethers.Contract(tokenAddress, MyToken.abi, data);
  }

  // request access to the user's MetaMask account
  async function requestAccount() {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setConnected("Connected");
    setUserAddress(account[0]);
  }

  // call the smart contract, read the current token supply
  const fetchTotalSupply = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.totalSupply();
        setSupply(data.toString());
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Call the smart contract, get the token symbol
  const fetchSymbol = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.symbol();
        setSymbol(`$${data}`);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Check if the contract is paused
  const fetchPaused = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.paused();
        setPaused(data.toString());
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the name of the contract
  const fetchName = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.name();
        setName(data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the hash for the minter of the contract
  const fetchMinter = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.MINTER_ROLE();
        return(data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // Get the hash for the pauser of the contract
  const fetchPauser = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.PAUSER_ROLE();
        return(data);
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  // See if the logged in wallet has certain roles
  const checkUserRole = async (role) => {
    if (!userAddress) return;
    let hash;
    
    if (role === "minter") {
      hash = await fetchMinter();
    } else if (role === "pauser") {
      hash = await fetchPauser();
    }
    
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.hasRole(hash, userAddress);
        if (role === "minter") {
          setMinter(data.toString());
        } else if (role === "pauser") {
          setPauser(data.toString());
        }
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  const fetchBalance = async (address) => {
    if (typeof window.ethereum !== 'undefined') {
      const contract = setContract(setProvider());
      try {
        const data = await contract.balanceOf(address);
        return(data.toNumber());
      } catch (err) {
        console.log("error: ", err);
      }
    }
  }

  const fetchUserBalance = async () => {
    if (!userAddress) return;
    const balance = await fetchBalance(userAddress);
    setUserBalance(balance);
  }

  const pauseToggle = async () => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      if (paused === "true") {
        const transaction = await contract.unpause();
        await transaction.wait();
      } else if (paused === "false") {
        const transaction = await contract.pause();
        await transaction.wait();
      }
      
      await fetchPaused();
    }
  }

  const mintTokens = async (address, amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.mint(address, amount);
      await transaction.wait();
    }
  }

  const burnTokens = async (amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.burn(amount);
      await transaction.wait();
    }
  }

  const burnTokensAddress = async (address, amount) => { 
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.burnFrom(address, amount);
      await transaction.wait();
    }
  }

  const burnHandler = async () => {
    if (!userAddress) return; 
    if (!burnTargetAddress) {
      await burnTokens(burnAmount);
    } else {
      await burnTokensAddress(burnTargetAddress, burnAmount);
    }
    updateBalances();
  }

  const transfer = async (address, amount) => {
    if (!userAddress) return;
    if (typeof window.ethereum !== 'undefined') {
      const provider = setProvider();
      const signer = provider.getSigner();
      const contract = setContract(signer);
      const transaction = await contract.transfer(address, amount);
      await transaction.wait();
    }
  }

  const updateBalances = () => {
    fetchTotalSupply();
    if (userAddress) {
      fetchUserBalance();
    }
  }

  useEffect(() => {
    fetchName();
    fetchSymbol();
    fetchTotalSupply();
    fetchPaused();
    
    if (userAddress) {
      fetchUserBalance();
      checkUserRole("minter");
      checkUserRole("pauser");
    }
  },[userAddress]);

  return (
    <div className="App">

      <Menu>
        <Menu.Item>Central Bank</Menu.Item>
        <Menu.Item position="right">
          <p>{userAddress}</p>
        </Menu.Item>
        <Menu.Item>
          <Button onClick={requestAccount}>{connected}</Button>
        </Menu.Item>
      </Menu>

      <div className="container">
        <h1>Welcome to the Central Bank of {name}</h1>
        <p>There are currently {Number(supply).toLocaleString()} {symbol} in circulation</p>
        <p>You currently have {Number(userBalance).toLocaleString()} tokens.</p>
        <p>Do you have minting permissions: {minter}</p>
        <p>Do you have pausing permissions: {pauser}</p>
        <p>Is this contract paused: {paused}</p>
        
        <Divider />

        <Grid columns='three' divided>
          <Grid.Row>
            <Grid.Column>
              <h2>Minting</h2>
              <p>Target Address</p>
              <Input onChange={(e) => setMintTargetAddress(e.target.value)} />
              <p>Token amount</p>
              <Input onChange={(e) => setMintAmount(e.target.value)} />
              <br />
              <Button className="adminButtons" color="green" onClick={() => mintTokens(mintTargetAddress,mintAmount)}>BRRRRRRR</Button>
            </Grid.Column>
            <Grid.Column>
              <h2>Burning</h2>
              <p>(Optional) Burn From Address</p>
              <Input onChange={(e) => setBurnTargetAddress(e.target.value)} />
              <p>Amount</p>
              <Input onChange={(e) => setBurnAmount(e.target.value)} />
              <br/>
              <Button className="adminButtons" color="red" onClick={burnHandler}>BURN!</Button>
            </Grid.Column>
            <Grid.Column>
              <h2>Transferring</h2>
              <p>Address to Send To</p>
              <Input onChange={(e) => setTransferTargetAddress(e.target.value)} />
              <p>Amount</p>
              <Input onChange={(e) => setTransferAmount(e.target.value)} />
              <br/>
              <Button className="adminButtons" color="blue" onClick={() => transfer(transferTargetAddress, transferAmount)}>SEND!</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Divider />

        <h2>DANGER ZONE</h2>
        <Button color="red" onClick={pauseToggle}>Pause Token</Button>

        
      </div>

    </div>
  )
};

export default App;