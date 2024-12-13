import { useState, useEffect } from 'react';
import { EtherscanProvider, Contract, Wallet } from 'ethers';
import { useNavigate } from 'react-router-dom';

const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";
const etherscanApiKey = import.meta.env.VITE_HOLESKY_API;
const privateKey = import.meta.env.VITE_PRIVATE_KEY;

const FakeBayc = () => {
  const [name, setName] = useState(null);
  const [totalSupply, setTotalSupply] = useState(null);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null); // Store the contract instance
  const [message, setMessage] = useState(null);
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

        if (abiData.status !== "1") {
          throw new Error(abiData.result || "Failed to fetch ABI.");
        }

        const abi = JSON.parse(abiData.result);
        const provider = new EtherscanProvider("holesky", etherscanApiKey);

        const contractInstance = new Contract(contractAddress, abi, provider);
        setContract(contractInstance); 

        const contractName = await contractInstance.name();
        const totalTokens = await contractInstance.totalSupply();

        setName(contractName);
        setTotalSupply(Number(totalTokens));
      } catch (err) {
        setError(err.message || "Error initializing contract.");
      }
    };

    setupContract();
  }, []);

  const claimToken = async () => {
    try {
      if (!contract) {
        throw new Error("Contract is not initialized.");
      }

      if (!privateKey) {
        throw new Error("Private key is missing.");
      }

      const provider = new EtherscanProvider("holesky", etherscanApiKey);
      const signer = new Wallet(privateKey, provider); // User wallet for signing transactions
      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.claimAToken();
      setMessage("Transaction sent. Waiting for confirmation...");

      await tx.wait(); // Wait for the transaction to be mined
      setMessage("Token claimed successfully!");

    } catch (err) {
      setMessage(err.message || "Error claiming token.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '0 20px' }}>
      <h1>Fake BAYC</h1>
      {name && <p><strong>Collection Name:</strong> {name}</p>}
      {totalSupply !== null && <p><strong>Total Tokens:</strong> {totalSupply}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <button onClick={claimToken} style={{ ...buttonStyle, marginTop: '30px' }}>
        Claim Token
      </button>
      {message && <p>{message}</p>}
  
      <div style={gridStyle}>
        {totalSupply !== null ? (
          Array.from({ length: totalSupply }).map((_, index) => (
            <button key={index} onClick={() => navigate(`/fake-bayc/${index}`)} style={buttonStyle}>
              View Token {index}
            </button>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

// Styling for the grid container
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  gap: '15px',
  maxWidth: '1000px',
  margin: '20px auto'
};

// Uniform button styling
const buttonStyle = {
  padding: '10px',
  width: '100%', // Ensures buttons use the full width of the grid cell
  background: '#333',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
};

export default FakeBayc;
