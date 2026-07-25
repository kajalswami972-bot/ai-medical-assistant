import React, { useState } from 'react';

function ForgotPassword({ setScreen }) {
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1: Verify Username, 2: Reset Password

  const handleVerify = () => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = users.find(u => u.username === username.trim());
    if (userExists) {
      setStep(2);
    } else {
      alert("Don't match the Username! Please enter the correct Username.");
    }
  };

  const handleReset = () => {
    if (!newPassword.trim()) return alert("Password cannot be empty!");
    
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = users.map(u => 
      u.username === username.trim() ? { ...u, password: newPassword.trim() } : u
    );
    
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    alert("Password successfully reset ho gaya!");
    setScreen('login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <div className="login-header" style={{ marginBottom: '20px' }}>
        <span className="back-arrow" onClick={() => setScreen('login')} style={{ cursor: 'pointer', fontSize: '20px' }}>← Back</span>
        <h2>Forgot Password</h2>
      </div>
      
      <div className="form-container">
        {step === 1 ? (
          <div className="input-group">
            <label>Enter Username</label>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button className="btn btn-primary" onClick={handleVerify} style={{ width: '100%', padding: '10px', background: '#009688', color: 'white', border: 'none', borderRadius: '8px' }}>Verify</button>
          </div>
        ) : (
          <div className="input-group">
            <label>Enter New Password</label>
            <input 
              type="password" 
              placeholder="New Password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} 
              style={{ width: '100%', padding: '10px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <button className="btn btn-primary" onClick={handleReset} style={{ width: '100%', padding: '10px', background: '#009688', color: 'white', border: 'none', borderRadius: '8px' }}>Update Password</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;