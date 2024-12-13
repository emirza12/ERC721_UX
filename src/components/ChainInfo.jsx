import { BrowserProvider } from 'ethers';
import { useEffect, useState } from 'react';

const ChainInfo = () => {
  const [chainId, setChainId] = useState(null);
  const [lastBlock, setLastBlock] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask.");
        return;
      }

      // Request connection to the wallet via MetaMask
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);  // Request access to MetaMask accounts
      const signer = await provider.getSigner();

      // Check the network
      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 17000) {
        window.location.href = "/error";  // If the wrong network is detected
        return;
      }

      // Retrieve network information
      const blockNumber = await provider.getBlockNumber();
      const address = await signer.getAddress();

      setChainId(Number(network.chainId));
      setLastBlock(blockNumber);
      setUserAddress(address);
      setIsConnected(true);  // Wallet is connected
      setError(null);  // Reset the error on success
    } catch (err) {
      setError("Failed to connect to MetaMask. Please try again.");  // Connection error
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) {
        setError("MetaMask not detected. Please install MetaMask.");
        return;
      }

      try {
        // Check if the user is already connected
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });

        if (accounts.length > 0) {
          connectWallet(); // If an account is found, attempt to connect
        }
      } catch (err) {
        setError("Failed to connect to MetaMask. Please try again.");
      }
    };

    checkConnection(); // Check MetaMask connection on page load
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '45px' }}>
      <h1>Holesky Chain Info</h1>

      {/* Display the button if not connected */}
      {!isConnected ? (
        <button
          onClick={connectWallet}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: '1px solid #333',
            backgroundColor: '#333',
            color: 'white'
          }}
        >
          Connect Wallet
        </button>
      ) : (
        // Display info once connected
        <div>
          <p><strong>Chain ID:</strong> {chainId}</p>
          <p><strong>Last Block:</strong> {lastBlock}</p>
          <p><strong>User Address:</strong> {userAddress}</p>
        </div>
      )}
      {/* Display the error only if an error occurs */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ChainInfo;
