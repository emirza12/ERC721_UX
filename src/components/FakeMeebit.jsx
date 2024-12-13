import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import signatureData from '../data/output-sig.json'; // Import of the signature

const contractAddress = "0x9B6F990793347005bb8a252A67F0FA4d56521447";
const etherscanApiKey = import.meta.env.VITE_HOLESKY_API; // Etherscan API key

const FakeMeebits = () => {
  const [contract, setContract] = useState(null);
  const [, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedTokenId, setSelectedTokenId] = useState(null);
  const [isTokenAvailable, setIsTokenAvailable] = useState(true);
  const [, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize the provider and contract on component mount
  useEffect(() => {
    const setupContract = async () => {
      try {
        if (!contractAddress || !etherscanApiKey) {
          throw new Error("Missing environment variables.");
        }
        if (!window.ethereum) {
          setError("MetaMask not detected. Please install MetaMask.");
          return;
        }

        // Create a provider using MetaMask
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Load the ABI from Etherscan
        const contractABIResponse = await fetch(
          `https://api-holesky.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`
        );
        const contractABIData = await contractABIResponse.json();

        if (contractABIData.status !== "1") {
          throw new Error("Failed to fetch ABI from Etherscan.");
        }

        const contractABI = JSON.parse(contractABIData.result);

        // Create the contract instance with ABI and signer
        const contractInstance = new Contract(contractAddress, contractABI, signer);
        setContract(contractInstance);

        // Get the user's address
        const userAccount = await signer.getAddress();
        setAccount(userAccount);
      } catch (err) {
        setError("Error setting up contract or provider");
      }
    };

    setupContract();
  }, []);

  const checkTokenStatus = async () => {
    if (!selectedTokenId || selectedTokenId < 0 || selectedTokenId > 19999) {
      setMessage("Please enter a valid Token ID (0-19999).");
      return;
    }

    try {
      if (!contract) {
        setMessage("Contract is not initialized.");
        return;
      }

      setLoading(true);
      setMessage("");

      // Check if the token has already been claimed
      const claimed = await contract.tokensThatWereClaimed(selectedTokenId);
      setIsTokenAvailable(!claimed); // If already claimed, cannot be claimed again

      if (claimed) {
        setMessage(`Token #${selectedTokenId} has already been minted.`);
      } else {
        setMessage(`Token #${selectedTokenId} is available to claim.`);
      }
    } catch (err) {
      setMessage("Error checking token status.");
      console.error("Error details:", err); // Display error details
    } finally {
      setLoading(false);
    }
  };

  const claimToken = async () => {
    if (!selectedTokenId || selectedTokenId < 0 || selectedTokenId > 19999) {
      setMessage("Please select a valid Token ID (0-19999).");
      return;
    }

    if (!isTokenAvailable) {
      setMessage(`Token #${selectedTokenId} has already been minted.`);
      return;
    }

    try {
      if (!contract) {
        setMessage("Contract is not initialized.");
        return;
      }

      setLoading(true);

      // Find the signature corresponding to the token ID
      const signatureEntry = signatureData.find(
        (entry) => entry.tokenNumber === selectedTokenId
      );

      if (!signatureEntry) {
        setMessage("Signature not found for the selected Token ID.");
        return;
      }

      const signature = signatureEntry.signature;

      if (!window.ethereum) {
        setMessage("MetaMask not detected. Please install MetaMask.");
        return;
      }

      // Connect to the contract with signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      // Verify that the address claiming is indeed from MetaMask
      const userAddress = await signer.getAddress();
      console.log("User address:", userAddress);

      // Claim the token
      const tx = await contractWithSigner.claimAToken(selectedTokenId, signature, {
        value: 0, // No additional value here, adjust if necessary
      });

      // Wait for the transaction confirmation
      await tx.wait();

      setMessage(`Token #${selectedTokenId} claimed successfully!`);
    } catch (err) {
      setMessage("Error claiming the token.");
      console.error("Error details:", err); // Display error details
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Fake Meebits - Claim Your Token</h1>
      <input
        type="number"
        placeholder="Enter Token ID (0-19999)"
        value={selectedTokenId || ""}
        onChange={(e) => setSelectedTokenId(Number(e.target.value))}
        style={{
          padding: "10px",
          marginBottom: "20px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          width: "300px",
        }}
        min="0"
        max="19999"
      />
      <br />
      <button
        onClick={checkTokenStatus}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginRight: "10px",
        }}
        disabled={loading}
      >
        {loading ? "Checking..." : "Check Token"}
      </button>
      <button
        onClick={claimToken}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: loading || !isTokenAvailable ? "not-allowed" : "pointer",
        }}
        disabled={loading || !isTokenAvailable}
      >
        {loading ? "Processing..." : "Claim Token"}
      </button>
      <p
        style={{
          color: message?.includes("successfully") || message?.includes("available")
            ? "green"
            : "red",
          marginTop: "20px",
        }}
      >
        {message}
      </p>
    </div>
  );
};

export default FakeMeebits;
