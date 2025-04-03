import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Admin from './components/Admin';
import LeaderboardPage from './components/LeaderboardPage';

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<ProtectedAdmin />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
        </Routes>
      </Router>
    </div>
  );
}

const ProtectedAdmin = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const inputEmail = prompt("Enter admin email:");
    const inputPass = prompt("Enter admin password:");

    const adminEmail = process.env.REACT_APP_ADMIN_EMAIL;
    const adminPass = process.env.REACT_APP_ADMIN_PASSWORD;

    if (inputEmail === adminEmail && inputPass === adminPass) {
      setIsAuthorized(true);
    } else {
      alert("Unauthorized");
      navigate('/');
    }
  }, [navigate]);

  return isAuthorized ? <Admin /> : null;
};

export default App;
