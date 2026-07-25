import React, { useState } from 'react'

function Signup({ username, setUsername, setScreen }) {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')

  const handleSignUp = () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      return alert("Kripya saari details fill karein!")
    }

    // New User Object
    const newUser = {
      username: username.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: password.trim()
    }

    // Existing users nikalo ya empty array banao
    const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // Check agar user pehle se exist karta hai
    const userExists = existingUsers.some(u => u.username === newUser.username || u.email === newUser.email)
    if (userExists) {
      return alert("This username or email is already registered! Please log in.")
    }

    // User ko save karo
    existingUsers.push(newUser)
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers))

    alert("Account created successfully! Please Login .")
    setScreen('login')
  }

  return (
    <div>
      <div className="login-header">
        <span className="back-arrow" onClick={() => setScreen('welcome')}>←</span>
        <h2>Sign Up</h2>
      </div>
      <div className="form-container" style={{ gap: '15px' }}>
        <div className="input-group">
          <label>Full Name</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            placeholder="Enter your number" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Create password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={handleSignUp}>
          Sign Up
        </button>
        <p className="switch-auth">
          Already have an account? <span className="link-text" onClick={() => setScreen('login')}>Login</span>
        </p>
      </div>
    </div>
  )
}

export default Signup