import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserPage from './pages/User';
import AdminPage from './pages/Admin';

function App() {
  return (
    <Router>
      <div style={{ 
        padding: '3rem 2rem', 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
      }}>
        <Routes>
          <Route path="/" element={<UserPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
