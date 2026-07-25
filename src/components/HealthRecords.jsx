import React, { useState, useEffect } from 'react';

// Sirf ek baar yahan export default likha hai
export default function HealthRecords({ setScreen }) {
  const [view, setView] = useState('home');
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('myHealthRecords');
    return saved ? JSON.parse(saved) : null;
  });
  const [formData, setFormData] = useState({ weight: '', height: '', bp: '', sugar: '', temp: '' });

  useEffect(() => {
    if (records) localStorage.setItem('myHealthRecords', JSON.stringify(records));
  }, [records]);

  const saveRecord = () => {
    setRecords(formData);
    setView('list');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span onClick={() => setScreen('dashboard')} style={{ cursor: 'pointer', fontSize: '24px' }}>←</span>
        <h2 style={{ marginLeft: '15px' }}>Health Records</h2>
      </div>

      {view === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setView('form')} style={{ padding: '20px', borderRadius: '15px', border: 'none', background: '#009688', color: '#fff', cursor: 'pointer' }}>+ Add Record</button>
          <button onClick={() => setView('list')} style={{ padding: '20px', borderRadius: '15px', border: '1px solid #009688', background: '#fff', color: '#009688', cursor: 'pointer' }}>View Records</button>
        </div>
      )}

      {view === 'form' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #ddd' }}>
          {['weight', 'height', 'bp', 'sugar', 'temp'].map((field) => (
            <input key={field} placeholder={field.toUpperCase()} style={{ width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '10px' }} 
              onChange={(e) => setFormData({...formData, [field]: e.target.value})} />
          ))}
          <button onClick={saveRecord} style={{ width: '100%', padding: '15px', background: '#009688', color: '#fff', borderRadius: '10px', border: 'none', cursor: 'pointer' }}>Save</button>
        </div>
      )}

      {view === 'list' && (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '20px', border: '1px solid #ddd' }}>
          <h3>Current Records</h3>
          {records ? Object.entries(records).map(([key, val]) => (
            <div key={key} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><strong>{key.toUpperCase()}:</strong> {val}</div>
          )) : <p>No records found!</p>}
          <button onClick={() => setView('home')} style={{ marginTop: '20px', width: '100%', padding: '10px', cursor: 'pointer' }}>Back</button>
        </div>
      )}
    </div>
  );
}