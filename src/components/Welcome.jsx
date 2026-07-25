import React from 'react'

// { setScreen } ek prop hai jo hume App.jsx se milega
function Welcome({ setScreen }) {
  return (
    <div className="welcome-content">
      <div className="illustration-container">
        <div className="doctor-illustration">🩺👨‍⚕️</div>
      </div>
      <h1>Welcome to<br /><span className="brand-name">AI Medical Assistant</span></h1>
      <p className="subtitle">Your personal health companion</p>
      <div className="button-group">
        <button className="btn btn-primary" onClick={() => setScreen('login')}>Get Started</button>
        <button className="btn btn-outline" onClick={() => setScreen('signup')}>Sign Up</button>
      </div>
    </div>
  )
}

export default Welcome