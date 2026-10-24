import React, { useState, useEffect } from "react";

export default function MedicineReminder({ setScreen }) {
const [medicines, setMedicines] = useState(() => {
try {
const saved = localStorage.getItem("myMedicines");
return saved ? JSON.parse(saved) : [];
} catch (error) {
console.error("Could not load medicines:", error);
return [];
}
});

const [form, setForm] = useState({
name: "",
dose: "",
time: "",
startDate: new Date().toLocaleDateString("en-CA"),
endDate: "",
});

const [notificationPermission, setNotificationPermission] = useState(
"Notification" in window ? Notification.permission : "unsupported"
);

// Save medicines whenever the list changes
useEffect(() => {
localStorage.setItem("myMedicines", JSON.stringify(medicines));
}, [medicines]);

// Request notification permission
const enableNotifications = async () => {
if (!("Notification" in window)) {
alert("Your browser does not support notifications.");
return;
}

try {
  const permission = await Notification.requestPermission();
  setNotificationPermission(permission);

  if (permission === "granted") {
    alert("Notifications enabled successfully!");
  } else {
    alert("Please allow notifications in your browser settings.");
  }
} catch (error) {
  console.error("Notification permission error:", error);
  alert("Unable to enable notifications.");
}

};

// Check reminders while the website is open
useEffect(() => {
const checkReminders = () => {
const now = new Date();

  const currentTime =
    String(now.getHours()).padStart(2, "0") +
    ":" +
    String(now.getMinutes()).padStart(2, "0");

  const today =
    String(now.getFullYear()) +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  setMedicines((previousMedicines) => {
    let hasChanges = false;

    const updatedMedicines = previousMedicines.map((medicine) => {
      const isWithinDateRange =
        (!medicine.startDate || today >= medicine.startDate) &&
        (!medicine.endDate || today <= medicine.endDate);

      const alreadyNotifiedToday =
        medicine.lastNotifiedDate === today;

      const shouldNotify =
        isWithinDateRange &&
        medicine.time === currentTime &&
        !alreadyNotifiedToday;

      if (!shouldNotify) {
        return medicine;
      }

      hasChanges = true;

      // Mark as notified so it does not repeat during this minute
      const updatedMedicine = {
        ...medicine,
        lastNotifiedDate: today,
      };

      // Show notification if permission is granted
      if (
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        try {
          new Notification("💊 Medicine Reminder", {
            body:
              "Time to take " +
              medicine.name +
              " (" +
              medicine.dose +
              ").",
          });
        } catch (error) {
          console.error("Could not display notification:", error);
        }
      } else {
        alert(
          "💊 Medicine Reminder!\nTime to take " +
            medicine.name +
            " (" +
            medicine.dose +
            ")."
        );
      }

      return updatedMedicine;
    });

    return hasChanges ? updatedMedicines : previousMedicines;
  });
};

// Check immediately and then every 10 seconds
checkReminders();

const intervalId = setInterval(checkReminders, 10000);

return () => clearInterval(intervalId);

}, []);

// Handle form fields
const handleChange = (event) => {
const { name, value } = event.target;

setForm((previousForm) => ({
  ...previousForm,
  [name]: value,
}));

};

// Save a new medicine
const handleSave = (event) => {
event.preventDefault();

if (
  !form.name.trim() ||
  !form.dose.trim() ||
  !form.time
) {
  alert("Please enter medicine name, dose, and time.");
  return;
}

if (
  form.startDate &&
  form.endDate &&
  form.endDate < form.startDate
) {
  alert("End date cannot be earlier than start date.");
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

setMedicines((previousMedicines) => [
  ...previousMedicines,
  newMedicine,
]);

setForm({
  name: "",
  dose: "",
  time: "",
  startDate: new Date().toLocaleDateString("en-CA"),
  endDate: "",
});

alert("Medicine saved successfully!");

};

// Mark a medicine as taken today
const handleMarkTaken = (id) => {
const now = new Date();

const today =
  String(now.getFullYear()) +
  "-" +
  String(now.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(now.getDate()).padStart(2, "0");

setMedicines((previousMedicines) =>
  previousMedicines.map((medicine) => {
    if (medicine.id !== id) {
      return medicine;
    }

    const takenDates = medicine.takenDates || [];

    if (takenDates.includes(today)) {
      return medicine;
    }

    return {
      ...medicine,
      takenDates: [...takenDates, today],
    };
  })
);

};

// Delete a medicine
const handleDelete = (id) => {
const confirmed = window.confirm(
"Are you sure you want to delete this medicine?"
);

if (confirmed) {
  setMedicines((previousMedicines) =>
    previousMedicines.filter((medicine) => medicine.id !== id)
  );
}

};

// Get today's date in YYYY-MM-DD format
const now = new Date();

const today =
String(now.getFullYear()) +
"-" +
String(now.getMonth() + 1).padStart(2, "0") +
"-" +
String(now.getDate()).padStart(2, "0");

return (
<div className="medicine-reminder">
<h2>💊 Medicine Reminder</h2>

  <p>
    Add your medicines and set reminders for your schedule.
  </p>

  <button
    type="button"
    onClick={enableNotifications}
  >
    🔔 Enable Notifications
  </button>

  <p>
    Notification status: <strong>{notificationPermission}</strong>
  </p>

  <form onSubmit={handleSave}>
    <div>
      <label htmlFor="medicine-name">
        Medicine Name *
      </label>

      <input
        id="medicine-name"
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter medicine name"
        required
      />
    </div>

    <div>
      <label htmlFor="medicine-dose">
        Dose *
      </label>

      <input
        id="medicine-dose"
        type="text"
        name="dose"
        value={form.dose}
        onChange={handleChange}
        placeholder="e.g. 1 tablet"
        required
      />
    </div>

    <div>
      <label htmlFor="medicine-time">
        Reminder Time *
      </label>

      <input
        id="medicine-time"
        type="time"
        name="time"
        value={form.time}
        onChange={handleChange}
        required
      />
    </div>

    <div>
      <label htmlFor="medicine-start">
        Start Date
      </label>

      <input
        id="medicine-start"
        type="date"
        name="startDate"
        value={form.startDate}
        onChange={handleChange}
      />
    </div>

    <div>
      <label htmlFor="medicine-end">
        End Date
      </label>

      <input
        id="medicine-end"
        type="date"
        name="endDate"
        value={form.endDate}
        onChange={handleChange}
      />
    </div>

    <button type="submit">
      ➕ Save Medicine
    </button>
  </form>

  <hr />

  <h3>📋 Saved Medicines</h3>

  {medicines.length === 0 ? (
    <p>No medicines added yet.</p>
  ) : (
    medicines.map((medicine) => {
      const takenToday = (
        medicine.takenDates || []
      ).includes(today);

      return (
        <div
          key={medicine.id}
          className="medicine-card"
        >
          <h4>{medicine.name}</h4>

          <p>
            <strong>Dose:</strong> {medicine.dose}
          </p>

          <p>
            <strong>Time:</strong> {medicine.time}
          </p>

          <p>
            <strong>Start Date:</strong>{" "}
            {medicine.startDate || "Not specified"}
          </p>

          <p>
            <strong>End Date:</strong>{" "}
            {medicine.endDate || "Not specified"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {takenToday ? "✅ Taken today" : "⏰ Not marked as taken"}
          </p>

          {!takenToday && (
            <button
              type="button"
              onClick={() => handleMarkTaken(medicine.id)}
            >
              ✅ Mark as Taken
            </button>
          )}

          <button
            type="button"
            onClick={() => handleDelete(medicine.id)}
          >
            🗑️ Delete
          </button>
        </div>
      );
    })
  )}

  {setScreen && (
    <button
      type="button"
      onClick={() => setScreen("home")}
    >
      ⬅️ Back to Home
    </button>
  )}
</div>

);
}