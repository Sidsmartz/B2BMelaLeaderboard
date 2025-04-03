import React, { useState, useEffect } from 'react';
import { database, auth } from '../config/firebase';
import { ref, push, onValue, set, remove } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [templateName, setTemplateName] = useState('');
  const [templatePrice, setTemplatePrice] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [templates, setTemplates] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stallNames, setStallNames] = useState({});
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserId(user.uid);

        const templateRef = ref(database, 'templates/' + user.uid);
        const transRef = ref(database, 'transactions/' + user.uid);
        const leaderboardRef = ref(database, 'leaderboard');
        const stallNameRef = ref(database, 'stallNames');

        onValue(templateRef, snapshot => {
          const data = snapshot.val() || {};
          setTemplates(Object.entries(data));
        });

        onValue(transRef, snapshot => {
          const data = snapshot.val() || {};
          const trans = Object.entries(data).map(([id, val]) => ({ id, ...val }));
          setTransactions(trans);
        });

        onValue(leaderboardRef, snapshot => {
          const data = snapshot.val() || {};
          const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
          setLeaderboard(sorted);
        });

        onValue(stallNameRef, snapshot => {
          const data = snapshot.val() || {};
          setStallNames(data);
        });
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAddTransaction = (amount) => {
    const amt = parseFloat(amount);
    if (!amt) return;
    const transRef = ref(database, 'transactions/' + userId);
    const newTrans = push(transRef);
    set(newTrans, {
      amount: amt,
      timestamp: Date.now()
    });

    const total = transactions.reduce((sum, t) => sum + t.amount, 0);
    set(ref(database, 'leaderboard/' + userId), total + amt);
    setTransactionAmount('');
  };

  const handleAddTemplate = () => {
    if (!templateName || !templatePrice) return;
    const templateRef = ref(database, 'templates/' + userId);
    const newKey = push(templateRef);
    set(newKey, {
      name: templateName,
      price: parseFloat(templatePrice)
    });
    setTemplateName('');
    setTemplatePrice('');
  };

  const deleteTransaction = (id, amount) => {
    remove(ref(database, 'transactions/' + userId + '/' + id));
    const newTotal = transactions.reduce((sum, t) => sum + t.amount, 0) - amount;
    set(ref(database, 'leaderboard/' + userId), newTotal);
  };

  return (
    <div className="container">
      <h2>Stall Dashboard</h2>

      <section>
        <h3>➕ Add Transaction</h3>
        <input
          type="number"
          placeholder="Enter amount (INR)"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
        />
        <button onClick={() => handleAddTransaction(transactionAmount)}>Add</button>
      </section>

      <section>
        <h3>🧾 Create Sales Template</h3>
        <input
          type="text"
          placeholder="Item name"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price (INR)"
          value={templatePrice}
          onChange={(e) => setTemplatePrice(e.target.value)}
        />
        <button onClick={handleAddTemplate}>Save Template</button>

        <div style={{ marginTop: '10px' }}>
          <h4>Saved Templates:</h4>
          {templates.map(([key, tpl]) => (
            <div key={key}>
              {tpl.name} - ₹{tpl.price}{' '}
              <button onClick={() => handleAddTransaction(tpl.price)}>Sell</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3>📜 Transaction History</h3>
        {transactions.map((t) => (
          <div key={t.id}>
            ₹{t.amount} - {new Date(t.timestamp).toLocaleString()}
            <button onClick={() => deleteTransaction(t.id, t.amount)}>🗑️</button>
          </div>
        ))}
      </section>

      <section>
        <h3>📊 Leaderboard</h3>
        {leaderboard.map(([uid, total], i) => (
          <div key={uid}>
            #{i + 1} - {stallNames[uid] || uid.slice(0, 6)} - ₹{total}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
