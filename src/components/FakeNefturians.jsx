import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { useNavigate } from 'react-router-dom';

const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";
const etherscanApiKey = import.meta.env.VITE_HOLESKY_API;

const FakeNefturians = () => {
  const [minPrice, setMinPrice] = useState(null);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState(null);
  const [userAddress, setUserAddress] = useState(null); // État pour stocker l'adresse de l'utilisateur
  const navigate = useNavigate();

  useEffect(() => {
    const setupContract = async () => {
      try {
        if (!contractAddress || !etherscanApiKey) {
          throw new Error("Missing environment variables.");
        }

        const abiResponse = await fetch(
          `https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`
        );
        const abiData = await abiResponse.json();
        console.log("Contract ABI:", abiResponse);

        if (abiData.status !== "1") {
          throw new Error(abiData.result || "Failed to fetch ABI.");
        }

        const abi = JSON.parse(abiData.result);
        if (!window.ethereum) {
          return;
        }

        const provider = new BrowserProvider(window.ethereum);
        const contractInstance = new Contract(contractAddress, abi, provider);
        setContract(contractInstance);

        const price = await contractInstance.tokenPrice();
        setMinPrice(Number(price) / 10 ** 18); // Convert from Wei to Ether

        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);
      } catch (err) {
        setError(err.message || "Error initializing contract.");
      }
    };

    setupContract();
  }, []);

  const buyToken = async () => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized.");
      }

      if (!minPrice) {
        throw new Error("Minimum price not available.");
      }

      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request MetaMask account access
      const signer = await provider.getSigner(); // Get signer from MetaMask
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.buyAToken({
        value: ((minPrice + 0.001) * 10 ** 18).toString(),
      });

      setMessage("Transaction sent. Waiting for confirmation...");
      await tx.wait();
      setMessage("Token purchased successfully!");
    } catch (err) {
      setMessage(err.message || "Error purchasing token.");
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{ marginBottom: '20px' }}>Fake Nefturians</h1>
      {minPrice !== null && (
        <p><strong>Minimum Token Price:</strong> {minPrice} ETH</p>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={buyToken}
        style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
      >
        Buy Token
      </button>
      {message && <p>{message}</p>}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate(`/fake-nefturians/${userAddress}`)}
        >
          View My Tokens
        </button>
      </div>
    </div>
  );
};

export default FakeNefturians;
