import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Room from './components/Room';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room" element={<Room />} />
    </Routes>
  );
};

export default App;
