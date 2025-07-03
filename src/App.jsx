
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom'
import MemoryGame from './components/play';

const App = () => {
  return (
      <div className='h-[100vh] bg-gray-900'>
        {/* <main> */}
        <Routes>
            <Route path="/" element={<MemoryGame/>} />
        </Routes>
        {/* </main> */}
      </div>
  );
};

export default App;
