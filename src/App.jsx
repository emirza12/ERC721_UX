import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import ChainInfo from './components/ChainInfo';
import ErrorPage from './components/ErrorPage';
import FakeBayc from './components/FakeBayc';
import FakeBaycToken from './components/TokenID';
import FakeNefturians from './components/FakeNefturians';
import NeftuAddress from './components/NeftuAddress';
import FakeMeebits from './components/FakeMeebit';
import './App.css';  

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/chain-info">Chain Info</Link></li>
          <li><Link to="/fake-bayc">Fake BAYC</Link></li>
          <li><Link to="/fake-nefturians">Fake Nefturians</Link></li>
          <li><Link to="/fake-meebits">Fake Meebits</Link></li>
        </ul>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/chain-info" element={<ChainInfo />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/fake-bayc" element={<FakeBayc />} />
          <Route path="/fake-bayc/:tokenId" element={<FakeBaycToken />} />
          <Route path="/fake-nefturians" element={<FakeNefturians />} />
          <Route path="/fake-nefturians/:userAddress" element={<NeftuAddress />} />
          <Route path="/fake-meebits" element={<FakeMeebits />} />
          <Route path="/" element={<Navigate to="/chain-info" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
