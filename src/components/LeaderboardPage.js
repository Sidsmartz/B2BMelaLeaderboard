import React, { useEffect, useState } from 'react';
import { database } from '../config/firebase';
import { ref, onValue } from 'firebase/database';

const LeaderboardPage = () => {
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
    <div className="container">
      <h2>📊 Overall Leaderboard</h2>
      {leaderboard.map(([uid, total], i) => (
        <div key={uid}>
          #{i + 1} - {stallNames[uid] || uid.slice(0, 6)} - ₹{total}
        </div>
      ))}
    </div>
  );
};

export default LeaderboardPage;
