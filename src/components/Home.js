import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container">
      <h1>Stall Management System</h1>
      <p>Welcome! Please <Link to="/login">Login</Link> to continue or if you are an admin, go to the <Link to="/admin">Admin Panel</Link>.</p>
      <p>Welcome! Click <Link to="/styled-leaderboard">here</Link> to go to the leaderboard</p>
    </div>
  );
};

export default Home;
