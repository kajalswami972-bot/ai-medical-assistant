
import React, { useState, useEffect, useRef } from "react";

const getToday = () => {
  const d = new Date();
  return (
    d.getFullYear() + "-" +
    String(d.getMonth() + 1).padStart(2, "0") + "-" +
    String(d.getDate()).padStart(2, "0")
  );
};

const styles = {
  page: {
    width: "100%",
    maxWidth: "700px",
    minHeight: "75vh",
    margin: "0 auto",
    padding: "22px 16px 110px",
    boxSizing: "border-box",
    background: "#f3faf6",
    borderRadius: "22px",
    color: "#263b35",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    color: "#087c59",
    fontSize: "27px",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#687b72",
    fontSize: "14px",
    lineHeight: 1.6,
    marginBottom: "20px",
  },
  notificationBox: {
    background: "#e3f5eb",
    border: "1px solid #cce9d8",
    padding: "15px",
    borderRadius: "14px",
    marginBottom: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "17px",
    padding: "18px",
    marginBottom: "18px",
    boxShadow: "0 4px 16px rgba(0,80,50,0.06)",
    border: "1px solid #e0eee5",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#35564a",
    marginBottom: "7px",
  },
  input: {
    width: "100%",
    height: "46px",
    padding: "10px 12px",
    boxSizing: "border-box",
    border: "1px solid #d6e6dc",
    borderRadius: "10px",
    background: "#f9fcfa",
    color: "#263b35",
    fontSize: "15px",
    marginBottom: "15px",
  },
  primaryButton: {
    width: "100%",
    minHeight: "46px",
    border: "none",
    borderRadius: "11px",
    background: "#087c59",
    color: "white",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer",
    padding: "12px",
  },
  secondaryButton: {
    minHeight: "40px",
    border: "none",
    borderRadius: "9px",
    background: "#e3f5eb",
    color: "#087c59",
    fontWeight: "bold",
    padding: "10px 13px",
    cursor: "pointer",
    margin: "5px 5px 5px 0",
  },
  deleteButton: {
    minHeight: "40px",
    border: "none",
    borderRadius: "9px",
    background: "#ffeded",
    color: "#c03939",
    fontWeight: "bold",
    padding: "10px 13px",
    cursor: "pointer",
    margin: "5px",
  },
  medicineName: {
    color: "#087c59",
    fontSize: "19px",
    margin: "0 0 12px",
  },
  info: {
    color: "#63746c",
    fontSize: "14px",
    margin: "8px 0",
  },
};

export default function MedicineReminder({ setScreen }) {
  const [medicines, setMedicines] = useState(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("myMedicines") || "[]"
      );

      return saved.map((med) => ({
        ...med,
        id: med.id || `${Date.now()}-${Math.random()}`,
        takenDates: med.takenDates || [],
        lastNotifiedDate: med.lastNotifiedDate || "",
      }));
    } catch (error) {
      console.error("Medicine loading error:", error);
      return [];
    }
  });

  const [form, setForm] = useState({
    name: "",
    dose: "",
    time: "",
    startDate: getToday(),
    endDate: "",
  });

  const [permission, setPermission] = useState(() =>
    "Notification" in window
      ? Notification.permission
      : "unsupported"
  );

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const medicinesRef = useRef(medicines);
  const notifiedRef = useRef(new Set());

  // Keep medicines updated
  useEffect(() => {
    medicinesRef.current = medicines;
    localStorage.setItem("myMedicines", JSON.stringify(medicines));
  }, [medicines]);

  // Show message
  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Enable and test notifications
  const enableNotifications = async () => {
    if (!("Notification" in window)) {
      showMessage(
        "Your browser does not support notifications.",
        "error"
      );
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === "granted") {
        new Notification("💊 Medicine Reminder", {
          body: "Your notifications are working!",
        });

        showMessage("Test notification sent successfully!");
      } else {
        showMessage(
          "Please allow notifications in your browser settings.",
          "error"
        );
      }
    } catch (error) {
      console.error(error);
      showMessage("Unable to show notification.", "error");
    }
  };

  // Reminder checker while website is open
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const today = getToday();

      const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");

      medicinesRef.current.forEach((medicine) => {
        const inDateRange =
          (!medicine.startDate || today >= medicine.startDate) &&
          (!medicine.endDate || today <= medicine.endDate);

        const key = medicine.id + "-" + today;

        if (
          !inDateRange ||
          medicine.time !== currentTime ||
          medicine.lastNotifiedDate === today ||
          notifiedRef.current.has(key)
        ) {
          return;
        }

        notifiedRef.current.add(key);

        const text =
          "Time to take " + medicine.name +
          " (" + medicine.dose + ").";

        showMessage("💊 " + text);

        if (
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          try {
            const notification = new Notification(
              "💊 Medicine Reminder",
              { body: text }
            );

            notification.onclick = () => window.focus();
          } catch (error) {
            console.error("Notification error:", error);
            alert(text);
          }
        } else {
          alert(text);
        }

        setMedicines((previous) =>
          previous.map((med) =>
            med.id === medicine.id
              ? { ...med, lastNotifiedDate: today }
              : med
          )
        );
      });
    };

    checkReminders();

    const timer = window.setInterval(checkReminders, 5000);

    return () => window.clearInterval(timer);
  }, []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add medicine
  const handleSave = (event) => {
    event.preventDefault();

    if (!form.name.trim() || !form.dose.trim() || !form.time) {
      showMessage("Please fill all required fields.", "error");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      showMessage("End date cannot be before start date.", "error");
      return;
    }

    const newMedicine = {
      id: `${Date.now()}-${Math.random()}`,
      name: form.name.trim(),
      dose: form.dose.trim(),
      time: form.time,
      startDate: form.startDate,
      endDate: form.endDate,
      lastNotifiedDate: "",
      takenDates: [],
    };

    setMedicines((previous) => [...previous, newMedicine]);

    setForm({
      name: "",
      dose: "",
      time: "",
      startDate: getToday(),
      endDate: "",
    });

    showMessage("Medicine added successfully!");
  };

  // Mark medicine as taken
  const markTaken = (id) => {
    const today = getToday();

    setMedicines((previous) =>
      previous.map((med) => {
        if (med.id !== id) return med;

        return {
          ...med,
          takenDates: [...new Set([...(med.takenDates || []), today])],
        };
      })
    );

    showMessage("Medicine marked as taken!");
  };

  // Delete medicine
  const deleteMedicine = (id) => {
    if (!window.confirm("Delete this medicine?")) return;

    setMedicines((previous) =>
      previous.filter((med) => med.id !== id)
    );

    showMessage("Medicine deleted.");
  };

  const today = getToday();

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>💊 Medicine Reminder</h2>

      <p style={styles.subtitle}>
        Manage your medicines and never miss your scheduled reminders.
      </p>

      <div style={styles.notificationBox}>
        <strong style={{ color: "#087c59" }}>
          🔔 Notification Settings
        </strong>

        <p style={styles.info}>
          Permission: <strong>{permission}</strong>
        </p>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={enableNotifications}
        >
          Enable & Test Notifications
        </button>
      </div>

      {message && (
        <div
          role="status"
          style={{
            padding: "12px",
            borderRadius: "10px",
            marginBottom: "16px",
            background:
              messageType === "error" ? "#ffeded" : "#e3f5eb",
            color:
              messageType === "error" ? "#b83232" : "#087c59",
          }}
        >
          {message}
        </div>
      )}

      <div style={styles.card}>
        <h3 style={{ color: "#087c59", marginTop: 0 }}>
          ➕ Add New Medicine
        </h3>

        <form onSubmit={handleSave}>
          <label style={styles.label}>Medicine Name *</label>
          <input
            style={styles.input}
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter medicine name"
            required
          />

          <label style={styles.label}>Dose *</label>
          <input
            style={styles.input}
            name="dose"
            value={form.dose}
            onChange={handleChange}
            placeholder="e.g. 1 tablet"
            required
          />

          <label style={styles.label}>Reminder Time *</label>
          <input
            style={styles.input}
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />

          <label style={styles.label}>Start Date</label>
          <input
            style={styles.input}
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
          />

          <label style={styles.label}>End Date</label>
          <input
            style={styles.input}
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />

          <button type="submit" style={styles.primaryButton}>
            ➕ Save Medicine
          </button>
        </form>
      </div>

      <h3 style={{ color: "#087c59" }}>
        📋 Your Saved Medicines
      </h3>

      {medicines.length === 0 ? (
        <div style={styles.card}>
          <p style={{ textAlign: "center", color: "#7a8982" }}>
            💊 No medicines added yet.
          </p>
        </div>
      ) : (
        medicines.map((medicine) => {
          const takenToday = (medicine.takenDates || []).includes(today);

          return (
            <div key={medicine.id} style={styles.card}>
              <h4 style={styles.medicineName}>
                💊 {medicine.name}
              </h4>

              <p style={styles.info}>
                <strong>Dose:</strong> {medicine.dose}
              </p>

              <p style={styles.info}>
                <strong>Reminder:</strong> {medicine.time}
              </p>

              <p style={styles.info}>
                <strong>Start:</strong> {medicine.startDate || "Not set"}
              </p>

              <p style={styles.info}>
                <strong>End:</strong> {medicine.endDate || "Not set"}
              </p>

              <p style={{ ...styles.info, fontWeight: "bold" }}>
                {takenToday ? "✅ Taken today" : "⏰ Pending"}
              </p>

              {!takenToday && (
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => markTaken(medicine.id)}
                >
                  ✓ Mark as Taken
                </button>
              )}

              <button
                type="button"
                style={styles.deleteButton}
                onClick={() => deleteMedicine(medicine.id)}
              >
                🗑 Delete
              </button>
            </div>
          );
        })
      )}

      {setScreen && (
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={() => setScreen("home")}
        >
          ← Back to Home
        </button>
      )}
    </div>
  );
}
