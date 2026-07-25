import React, { useState, useEffect } from 'react'
import Welcome from './components/Welcome'
import Login from './components/Login'
import Signup from './components/Signup'
import ForgotPassword from './components/ForgotPassword' // Import add kar diya
import Dashboard from './components/Dashboard'
import SymptomChecker from './components/SymptomChecker'
import BMICalculator from './components/BMICalculator'
import PrescriptionAnalyzer from './components/PrescriptionAnalyzer'
import MedicineReminder from './components/MedicineReminder'
import HealthRecords from './components/HealthRecords'

function App() {
  const [screen, setScreen] = useState('welcome')
  const [username, setUsername] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Authentication Guard
  const [hasNotification, setHasNotification] = useState(false)

  // Chat States
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! Main aapka AI Health Assistant hoon. Aapko kya pareshani ho rahi hai?", sender: 'ai' }])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // BMI States
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [bmiResult, setBmiResult] = useState(null)
  const [bmiStatus, setBmiStatus] = useState('')

  // Notification Checker Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const medicines = JSON.parse(localStorage.getItem('myMedicines') || "[]")
      const now = new Date()
      const currentTime = now.getHours().toString().padStart(2, '0') + ":" + 
                          now.getMinutes().toString().padStart(2, '0')

      const isTimeReached = medicines.some(med => med.time === currentTime)
      if (isTimeReached) setHasNotification(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Logout Functionality
  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
    setScreen('welcome')
  }

  const sendMessage = async () => {
    if (!inputText.trim()) return
    const userMessage = { id: Date.now(), text: inputText, sender: 'user' }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputText
    setInputText('')
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/check-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: currentInput }),
      })
      const data = await response.json()
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: data.result, sender: 'ai' }])
    } catch (error) {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: "🚨 Unable to connect to the server.", sender: 'ai' }])
    } finally { 
      setIsLoading(false) 
    }
  }

  const calculateBMI = () => {
    if (!weight || !height) return alert("Enter weight and height!")
    const h = height / 100
    const bmi = (weight / (h * h)).toFixed(1)
    setBmiResult(bmi)
    if (bmi < 18.5) setBmiStatus('Underweight 🟡')
    else if (bmi < 24.9) setBmiStatus('Normal 🟢')
    else if (bmi < 29.9) setBmiStatus('Overweight 🟠')
    else setBmiStatus('Obese 🔴')
  }

  return (
    <div className="app-container" style={{ paddingBottom: '80px' }}>
      
      {/* Auth Screens */}
      {screen === 'welcome' && <Welcome setScreen={setScreen} />}
      {screen === 'login' && (
        <Login 
          username={username} 
          setUsername={setUsername} 
          setScreen={setScreen} 
          setIsLoggedIn={setIsLoggedIn} 
        />
      )}
      {screen === 'signup' && (
        <Signup 
          username={username} 
          setUsername={setUsername} 
          setScreen={setScreen} 
        />
      )}
      {screen === 'forgot-password' && <ForgotPassword setScreen={setScreen} />} {/* Added this line */}
      
      {/* Protected App Screens */}
      {isLoggedIn ? (
        <>
          {screen === 'dashboard' && (
            <Dashboard 
              username={username} setScreen={setScreen} setWeight={setWeight} 
              setHeight={setHeight} setBmiResult={setBmiResult} setBmiStatus={setBmiStatus} 
              hasNotification={hasNotification} setHasNotification={setHasNotification}
            />
          )}
          
          {screen === 'symptom-checker' && <SymptomChecker messages={messages} inputText={inputText} setInputText={setInputText} sendMessage={sendMessage} setScreen={setScreen} isLoading={isLoading} />}
          {screen === 'bmi-calculator' && <BMICalculator weight={weight} setWeight={setWeight} height={height} setHeight={setHeight} bmiResult={bmiResult} bmiStatus={bmiStatus} calculateBMI={calculateBMI} setScreen={setScreen} />}
          {screen === 'prescription-analyzer' && <PrescriptionAnalyzer setScreen={setScreen} />}
          {screen === 'medicine-reminder' && <MedicineReminder setScreen={setScreen} />}
          {screen === 'health-records' && <HealthRecords setScreen={setScreen} />}

          {/* PERMANENT NAVIGATION BAR */}
          <div className="bottom-nav">
            <div className={`nav-item ${screen === 'dashboard' ? 'active' : ''}`} onClick={() => setScreen('dashboard')}>🏠<p>Home</p></div>
            <div className={`nav-item ${screen === 'health-records' ? 'active' : ''}`} onClick={() => setScreen('health-records')}>📂<p>Records</p></div>
            <div className={`nav-item ${screen === 'medicine-reminder' ? 'active' : ''}`} onClick={() => setScreen('medicine-reminder')}>⏰<p>Reminder</p></div>
            <div className="nav-item" onClick={handleLogout}>👤<p>Logout</p></div>
          </div>
        </>
      ) : (
        /* Access Denied Logic */
        (screen !== 'welcome' && screen !== 'login' && screen !== 'signup' && screen !== 'forgot-password') && (
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <h2>⚠️ Access Denied</h2>
            <p>Aapko pehle Login karna padega.</p>
            <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => setScreen('login')}>
              Go to Login
            </button>
          </div>
        )
      )}

    </div>
  )
}

export default App