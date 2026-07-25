import React from 'react'

function Dashboard({ username, setScreen, setWeight, setHeight, setBmiResult, setBmiStatus, hasNotification, setHasNotification }) {
  
  const handleNotificationClick = () => {
    setHasNotification(false);
    alert("Time to take your medicine!");
  };

  const openBMI = () => {
    setWeight(''); setHeight(''); setBmiResult(null); setBmiStatus(''); setScreen('bmi-calculator');
  }

  const handleSOS = () => {
    const confirmSOS = window.confirm("Do you want to call the emergency services (112) ?");
    if (confirmSOS) window.location.href = "tel:112";
  };

  return (
    <div className="dashboard-container">
      {/* HEADER WAHI HAI */}
      <div className="dashboard-header">
        <div>
          <h3>Hello, {username} 👋</h3>
          <p>Take care of your health every day.</p>
        </div>
        {/* BELL ICON WAHI HAI */}
        <div className="notification-icon" onClick={handleNotificationClick} style={{ position: 'relative', cursor: 'pointer' }}>
          🔔
          {hasNotification && (
            <span style={{ position: 'absolute', top: '0', right: '0', width: '10px', height: '10px', background: 'red', borderRadius: '50%' }}></span>
          )}
        </div>
      </div>

      {/* FEATURES GRID WAHI HAI */}
      <div className="features-grid">
        <div className="feature-card" onClick={() => setScreen('symptom-checker')}>
          <div className="card-icon" style={{ backgroundColor: '#e3f2fd', color: '#2196f3' }}>🩺</div>
          <h4>Symptom Checker</h4>
        </div>
        
        <div className="feature-card" onClick={() => setScreen('prescription-analyzer')}>
          <div className="card-icon" style={{ backgroundColor: '#e1f5fe', color: '#03a9f4' }}>📄</div>
          <h4>Prescription Analyzer</h4>
        </div>
        
        <div className="feature-card" onClick={() => setScreen('medicine-reminder')}>
          <div className="card-icon" style={{ backgroundColor: '#fff3e0', color: '#ff9800' }}>💊</div>
          <h4>Medicine Reminder</h4>
        </div>
        
        <div className="feature-card" onClick={() => setScreen('health-records')}>
          <div className="card-icon" style={{ backgroundColor: '#e8eaf6', color: '#3f51b5' }}>📂</div>
          <h4>Health Records</h4>
        </div>
        
        <div className="feature-card" onClick={openBMI}>
          <div className="card-icon" style={{ backgroundColor: '#e0f2f1', color: '#009688' }}>⚖️</div>
          <h4>BMI Calculator</h4>
        </div>
        
        <div className="feature-card" onClick={handleSOS}>
          <div className="card-icon" style={{ backgroundColor: '#ffebee', color: '#f44336' }}>🚨</div>
          <h4 style={{ color: '#f44336' }}>Emergency SOS</h4>
        </div>
      </div>

    </div>
  )
}

export default Dashboard