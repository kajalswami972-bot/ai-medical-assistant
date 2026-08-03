import React, { useState } from "react";

export default function PrescriptionAnalyzer({ setScreen }) {
  const [base64Image, setBase64Image] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBase64Image(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    }
  };

  const analyze = async () => {
    if (!base64Image) return alert("Pehle photo upload karo!");
    setLoading(true);
    setResult("Analyzing... please wait...");
    
    try {
      const response = await fetch("https://ai-medical-backend-0ick.onrender.com/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64Image }),
      });
      const data = await response.json();
      if (response.ok) setResult(data.result);
      else alert("Error: " + data.error);
    } catch (err) {
      alert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span onClick={() => setScreen('dashboard')} style={{ cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}>←</span>
        <h2>Prescription Analyzer</h2>
      </div>

      {/* Image Upload Box */}
      <div style={{ border: '2px dashed #aaa', padding: '20px', textAlign: 'center', margin: '20px 0', borderRadius: '10px' }}>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      <h3>Analyze Report (Summary):</h3>
      
      {/* Scrollable Result Area (400px height) */}
      <div style={{ 
        width: '100%', 
        height: '400px',        
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        padding: '15px',
        overflowY: 'auto',      
        backgroundColor: '#fff',
        marginBottom: '20px',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' 
      }}>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>
          {loading ? "Analyzing... please wait..." : (result || "Result come here...")}
        </pre>
      </div>

      <button onClick={analyze} disabled={loading} style={{ 
        width: '100%', 
        padding: '15px', 
        background: '#009688', 
        color: 'white', 
        border: 'none', 
        borderRadius: '8px', 
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold' 
      }}>
        {loading ? "Analyzing..." : "Analyze Report"}
      </button>
    </div>
  );
}