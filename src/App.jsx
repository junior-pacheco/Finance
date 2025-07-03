
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'
import Portal from './components/portal';
import MemoryGame from './components/MemoryGame';
import Game2048 from './components/Game2048';
import MinesweeperGame from './components/MinesweeperGame';

const App = () => {
  return (
      <div className='h-[100vh]'>
        {/* <main> */}
        <Routes>
            <Route path="/" element={<Portal/>} />
            <Route path="/MemoryGame" element={<MemoryGame/>} />
            <Route path="/Game2048" element={<Game2048/>} />
            <Route path="/MinesweeperGame" element={<MinesweeperGame/>} />
        </Routes>
        {/* </main> */}
      </div>
  );
};

export default App;