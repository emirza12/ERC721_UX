import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { EtherscanProvider, Contract } from 'ethers';

const contractAddress = "0xdecFAB04fb08cC5da6365C18B26A6B9b1D4BEDFE";
const etherscanApiKey = import.meta.env.VITE_HOLESKY_API;

const FakeBaycToken = () => {
  const { tokenId } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [ownerAddress, setOwnerAddress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const resolveIpfsUrl = (url) => {
    const ipfsGateway = "https://gateway.pinata.cloud/ipfs/";
    if (url.startsWith("ipfs://")) {
      return `${ipfsGateway}${url.split("ipfs://")[1]}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchTokenMetadata = async () => {
      try {
        if (!contractAddress || !etherscanApiKey || !tokenId) {
          throw new Error("Missing environment variables or token ID.");
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
        const contract = new Contract(contractAddress, abi, provider);

        // Fetch the token URI (metadata)
        const tokenURI = await contract.tokenURI(tokenId);
        const response = await fetch(resolveIpfsUrl(tokenURI));
        if (!response.ok) {
          throw new Error(`Metadata not found for token ID ${tokenId}.`);
        }

        const metadata = await response.json();
        setMetadata(metadata);

        // Fetch the owner address
        const owner = await contract.ownerOf(tokenId);
        setOwnerAddress(owner);

      } catch (err) {
        if (err.message.includes("ERC721: invalid token ID")) {
          setError(`Token ID ${tokenId} does not exist.`);
        } else {
          setError(err.message || "Error fetching token metadata.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTokenMetadata();
  }, [tokenId]);

  if (loading) return <p>Loading...</p>;

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px', color: 'white' }}>
        <h1>This token doesn’t exist...</h1>
        <button
          onClick={() => (window.location.href = '/fake-bayc')}
          style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        >
          Back to Collection
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Fake BAYC - Token #{tokenId}</h1>
      {metadata && (
        <div>
          {metadata.image ? (
            <img
              src={resolveIpfsUrl(metadata.image)}
              alt={`Token ${tokenId}`}
              style={{ maxWidth: '300px', borderRadius: '10px' }}
              onError={(e) => {
                if (!e.currentTarget.src.endsWith('/placeholder.png')) {
                  e.currentTarget.onerror = null; // prevent infinite callback loop
                  e.currentTarget.src = "/placeholder.png"; // fallback image
                }
              }}
            />
          ) : (
            <p>Image not available</p>
          )}
          <h2>Attributes</h2>
          {metadata.attributes && metadata.attributes.length > 0 ? (
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {metadata.attributes.map((attr, index) => (
                <li key={index} style={{ margin: '10px 0' }}>
                  <strong>{attr.trait_type}:</strong> {attr.value}
                </li>
              ))}
            </ul>
          ) : (
            <p>No attributes available.</p>
          )}

          {/* Displaying the owner address */}
          {ownerAddress && (
            <div>
              <h3>Owner Address:</h3>
              <p>{ownerAddress}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FakeBaycToken;
