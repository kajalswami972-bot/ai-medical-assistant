import React from 'react';

export default function BottomNav({ setScreen }) {
  // Styles ko thoda aur achha kar diya hai
  const navStyle = {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'space-around',
    padding: '10px 0', background: '#fff',
    borderTop: '1px solid #ddd', zIndex: 1000,
    boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
  };

  const itemStyle = { textAlign: 'center', cursor: 'pointer', fontSize: '12px' };

  return (
    <div style={navStyle}>
      {/* 1. Home button -> Dashboard */}
      <div onClick={() => setScreen('dashboard')} style={itemStyle}>
        <div style={{fontSize: '20px'}}>🏠</div>
        <div>Home</div>
      </div>

      {/* 2. Records button -> HealthRecords */}
      <div onClick={() => setScreen('health-records')} style={itemStyle}>
        <div style={{fontSize: '20px'}}>📁</div>
        <div>Records</div>
      </div>

      {/* 3. Reminder button -> MedicineReminder */}
      <div onClick={() => setScreen('medicine-reminder')} style={itemStyle}>
        <div style={{fontSize: '20px'}}>⏰</div>
        <div>Reminder</div>
      </div>

      {/* 4. Logout button -> Welcome screen */}
      <div onClick={() => setScreen('welcome')} style={itemStyle}>
        <div style={{fontSize: '20px'}}>👤</div>
        <div>Logout</div>
      </div>
    </div>
  );
}