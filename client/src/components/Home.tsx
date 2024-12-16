import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Decentralized Room</h1>
      <Link to="/room">
        <button>Enter Room</button>
      </Link>
    </div>
  );
};

export default Home;
