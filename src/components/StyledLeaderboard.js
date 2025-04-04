import React, { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';
import './StyledLeaderboard.css';

const StyledLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [stallNames, setStallNames] = useState({});

  useEffect(() => {
    const leaderboardRef = ref(database, 'leaderboard');
    const namesRef = ref(database, 'stallNames');

    onValue(leaderboardRef, (snapshot) => {
      const data = snapshot.val() || {};
      const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
      setLeaderboard(sorted);
    });

    onValue(namesRef, (snapshot) => {
      const data = snapshot.val() || {};
      setStallNames(data);
    });
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>🏆 B2B Mela Leaderboard</h1>
      <h2>Visit the stalls in front of CIE for exciting brands showcasing their products!</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Stall</th>
            <th>Total Earnings</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map(([uid, total], i) => (
            <tr key={uid} className={`rank-${i + 1}`}>
              <td>#{i + 1}</td>
              <td>{stallNames[uid] || uid.slice(0, 6)}</td>
              <td>₹{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StyledLeaderboard;
