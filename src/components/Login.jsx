import React, { useState } from 'react'

function Login({ username, setUsername, setScreen, setIsLoggedIn }) {
  const [loginInput, setLoginInput] = useState(username === 'User' ? '' : username)
  const [password, setPassword] = useState('')

  const handleLoginSubmit = () => {
    if (!loginInput.trim() || !password.trim()) {
      return alert("Kripya Username aur Password dono bharein!")
    }

    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

    // Find user in saved data
    const validUser = registeredUsers.find(
      u => (u.username === loginInput.trim() || u.email === loginInput.trim()) && u.password === password.trim()
    )

    if (validUser) {
      setUsername(validUser.username)
      setIsLoggedIn(true) // Authentication Successful
      setScreen('dashboard')
    } else {
      alert("Wrong Username/Email or Password! Please sign up first if you don't have an account.")
    }
  }

  return (
    <div>
      <div className="login-header">
        <span className="back-arrow" onClick={() => setScreen('welcome')}>←</span>
        <h2>Login</h2>
      </div>
      <div className="form-container">
        <div className="input-group">
          <label>Email / Username</label>
          <input 
            type="text" 
            placeholder="Enter your name or email" 
            value={loginInput} 
            onChange={(e) => setLoginInput(e.target.value)} 
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* Yahan maine link update kar diya hai */}
        <div className="forgot-pass">
          <a href="#" onClick={(e) => { e.preventDefault(); setScreen('forgot-password'); }}>Forgot Password?</a>
        </div>
        <button className="btn btn-primary" onClick={handleLoginSubmit}>Login</button>
        <p className="switch-auth">
          Don't have an account? <span className="link-text" onClick={() => setScreen('signup')}>Sign Up</span>
        </p>
      </div>
    </div>
  )
}

export default Login