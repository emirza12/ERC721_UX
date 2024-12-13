import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Contract, BrowserProvider } from 'ethers';

const contractAddress = "0x92Da472BE336A517778B86D7982e5fde0C7993c1";
const etherscanApiKey = import.meta.env.VITE_HOLESKY_API;

const FakeNefturiansUser = () => {
  const { userAddress } = useParams(); // Grabbing userAddress from URL parameters
  const [tokens, setTokens] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupContract = async () => {
      try {
        if (!contractAddress || !etherscanApiKey) {
          throw new Error("Missing environment variables.");
        }

        // Fetch the contract's ABI
        const abiResponse = await fetch(`https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`);
        const abiData = await abiResponse.json();
        if (abiData.status !== "1") {
          throw new Error("Failed to fetch ABI: " + abiData.result);
        }

        const abi = JSON.parse(abiData.result);
        const provider = new BrowserProvider(window.ethereum);
        const contract = new Contract(contractAddress, abi, provider);

        // Request account access if needed
        await provider.send("eth_requestAccounts", []);

        // Fetch tokens owned by user
        const balance = await contract.balanceOf(userAddress);
        const balanceNumber = parseInt(balance.toString(), 10);
        const tokenMetadata = [];

        for (let i = 0; i < balanceNumber; i++) {
          const tokenId = await contract.tokenOfOwnerByIndex(userAddress, i);
          const tokenURI = await contract.tokenURI(tokenId);
          const metadataResponse = await fetch(tokenURI);
          const metadata = await metadataResponse.json();
          tokenMetadata.push({ tokenId, ...metadata });
        }

        setTokens(tokenMetadata);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    setupContract();
  }, [userAddress]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Fake Nefturians for {userAddress}</h1>
      {tokens.length === 0 ? (
        <p>No tokens found for this address.</p>
      ) : (
        tokens.map((token, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid gray',borderRadius: '8px' }}>
            <h3>{token.name}</h3>
            <p>{token.description}</p>
            <img src={token.image} alt={token.name} style={{ maxWidth: '200px' }}
              onError={(e) => e.target.src = 'https://via.placeholder.com/200'}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default FakeNefturiansUser;
