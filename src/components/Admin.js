import React, { useEffect, useState } from 'react';
import { auth, database } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set, onValue, remove } from 'firebase/database';

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [stallName, setStallName] = useState('');
  const [stallList, setStallList] = useState([]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;
      await set(ref(database, 'stallNames/' + uid), stallName);
      alert("Stall user created successfully!");
      setEmail('');
      setPassword('');
      setStallName('');
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  useEffect(() => {
    const refNames = ref(database, 'stallNames');
    onValue(refNames, snapshot => {
      const data = snapshot.val() || {};
      setStallList(Object.entries(data));
    });
  }, []);

  const handleDeleteStall = (uid) => {
    remove(ref(database, 'stallNames/' + uid));
    remove(ref(database, 'transactions/' + uid));
    remove(ref(database, 'templates/' + uid));
    remove(ref(database, 'leaderboard/' + uid));
  };

  return (
    <div className="container">
      <h2>Create Stall Credentials</h2>
      <form onSubmit={handleCreateUser}>
        <input type="email" placeholder="Stall Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Stall Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="text" placeholder="Stall Display Name" value={stallName} onChange={(e) => setStallName(e.target.value)} required />
        <button type="submit">Create</button>
      </form>

      <h3>All Stalls</h3>
      {stallList.map(([uid, name]) => (
        <div key={uid}>
          {name} ({uid.slice(0, 6)}...)
          <button onClick={() => handleDeleteStall(uid)}>🗑️ Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Admin;
