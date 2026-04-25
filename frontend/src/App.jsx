import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Stage1 from './pages/Stage1';
import Stage2 from './pages/Stage2';
import Stage3 from './pages/Stage3';
import Stage4 from './pages/Stage4';
import Ending from './pages/Ending';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/stage1" />} />
        <Route path="/stage1" element={<Stage1 />} />
        <Route path="/stage2" element={<Stage2 />} />
        <Route path="/stage3" element={<Stage3 />} />
        <Route path="/stage4" element={<Stage4 />} />
        <Route path="/ending" element={<Ending />} />
      </Routes>
    </Router>
  );
}

export default App;
