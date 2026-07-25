import React, { useState, useEffect } from 'react';

export default function MedicineReminder({ setScreen }) {
  const [medicines, setMedicines] = useState(() => {
    const saved = localStorage.getItem('myMedicines');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [form, setForm] = useState({ name: '', dose: '', time: '', startDate: '', endDate: '' });

  // Data save karne ke liye
  useEffect(() => {
    localStorage.setItem('myMedicines', JSON.stringify(medicines));
  }, [medicines]);

  // Handle Save
  const handleSave = () => {
    if (form.name && form.dose && form.time) {
      setMedicines([...medicines, form]);
      setForm({ name: '', dose: '', time: '', startDate: '', endDate: '' });
      alert("Medicine saved successfully!");
    } else {
      alert("Please fill all required fields (Name, Dose, Time)!");
    }
  };

  // Medicine Done (Delete) karne ke liye
  const handleDone = (index) => {
    const updatedList = medicines.filter((_, i) => i !== index);
    setMedicines(updatedList);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <span onClick={() => setScreen('dashboard')} style={{ cursor: 'pointer', fontSize: '24px' }}>←</span>
        <h2 style={{ marginLeft: '15px' }}>Medicine Reminder</h2>
      </div>

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '20px', padding: '20px', marginBottom: '20px' }}>
        <h3>Add Medicine</h3>
        <label>Medicine Name</label>
        <input style={{ width: '100%', padding: '12px', margin: '5px 0 10px', borderRadius: '10px', border: '1px solid #ccc' }} value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g., PCM" />
        
        <label>Dose</label>
        <input style={{ width: '100%', padding: '12px', margin: '5px 0 10px', borderRadius: '10px', border: '1px solid #ccc' }} value={form.dose} onChange={(e) => setForm({...form, dose: e.target.value})} placeholder="e.g., 1 tablet" />
        
        <label>Time</label>
        <input type="time" style={{ width: '100%', padding: '12px', margin: '5px 0 10px', borderRadius: '10px', border: '1px solid #ccc' }} value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />

        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Start Date</label>
            <input type="date" style={{ width: '100%', padding: '12px', margin: '5px 0 10px', borderRadius: '10px', border: '1px solid #ccc' }} value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} />
          </div>
          <div style={{ flex: 1 }}>
            <label>End Date</label>
            <input type="date" style={{ width: '100%', padding: '12px', margin: '5px 0 10px', borderRadius: '10px', border: '1px solid #ccc' }} value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} />
          </div>
        </div>

        <button onClick={handleSave} style={{ width: '100%', padding: '15px', background: '#009688', color: '#fff', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }}>Save Medicine</button>
      </div>

      <div>
        <h3>Today's Medicines</h3>
        {medicines.length > 0 ? (
          medicines.map((med, index) => (
            <div key={index} style={{ background: '#fff', padding: '15px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{med.name}</strong>
                <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#555' }}>Dose: {med.dose} | Time: {med.time}</p>
              </div>
              <button 
                onClick={() => handleDone(index)}
                style={{ background: '#009688', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          ))
        ) : <p style={{ color: '#888' }}>No medicines scheduled for now.</p>}
      </div>
    </div>
  );
}