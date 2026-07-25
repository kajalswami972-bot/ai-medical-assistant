import React from 'react'

function BMICalculator({ weight, setWeight, height, setHeight, bmiResult, bmiStatus, calculateBMI, setScreen }) {
  return (
    <div>
      <div className="login-header">
        <span className="back-arrow" onClick={() => setScreen('dashboard')}>←</span>
        <h2>BMI Calculator</h2>
      </div>

      <div className="form-container">
        <div className="input-group">
          <label>Weight (kg)</label>
          <input type="number" placeholder="e.g. 60" value={weight} onChange={(e) => setWeight(e.target.value)} />
        </div>
        <div className="input-group">
          <label>Height (cm)</label>
          <input type="number" placeholder="e.g. 165" value={height} onChange={(e) => setHeight(e.target.value)} />
        </div>
        <button className="btn btn-primary" style={{ marginTop: '10px' }} onClick={calculateBMI}>
          Calculate BMI
        </button>

        {bmiResult && (
          <div className="bmi-result-box">
            <p>Your BMI is: <strong style={{ fontSize: '20px', color: '#009688' }}>{bmiResult}</strong></p>
            <p>Status: <strong>{bmiStatus}</strong></p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BMICalculator