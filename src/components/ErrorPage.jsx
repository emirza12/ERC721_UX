const ErrorPage = () => {
    const retry = () => {
      window.location.href = "/chain-info";
    };
  
    return (
      <div>
        <h1 style={{ marginBottom: '20px' }}>Error</h1>
        <p>You are not connected to the Holesky network. Please switch networks in Metamask.</p>
        <button onClick={retry}>Retry</button>
      </div>
    );
  };
  
  export default ErrorPage;
  