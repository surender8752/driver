import { useState } from "react";
import api from "./api";
import "./App.css";


function App() {
  const [driverName, setDriverName] = useState("");
  const [day, setDay] = useState(null);
  const [trip, setTrip] = useState({});
  const [fuel, setFuel] = useState(0);
  const [log, setLog] = useState(null);

  const startDay = async () => {
    const res = await api.post("/day/start", { driverName });
    setDay(res.data);
  };

  const createTrip = async () => {
    const res = await api.post(`/day/trip/${day._id}`, trip);
    setTrip({ ...trip, id: res.data._id });
  };

  const completeTrip = async () => {
    await api.put(`/day/trip/complete/${trip.id}`, trip);
  };

  const endDay = async () => {
    await api.put(`/day/end/${day._id}`, { fuelExpense: fuel });
    const res = await api.get(`/day/log/${day._id}`);
    setLog(res.data);
  };

  return (
  <div className="container">
    <h2>🚖 Driver Daily Log Book</h2>

    {!day && (
      <div className="section">
        <input
          placeholder="Driver Name"
          onChange={e => setDriverName(e.target.value)}
        />
        <button onClick={startDay}>Start Day</button>
      </div>
    )}

    {day && (
      <>
        <div className="badge">Day Started</div>

        <div className="section">
          <h3>Create Trip</h3>
          <input
            placeholder="Trip Title"
            onChange={e => setTrip({ ...trip, title: e.target.value })}
          />
          <select
            onChange={e => setTrip({ ...trip, type: e.target.value })}
          >
            <option value="">Select Trip Type</option>
            <option value="pickup">Pickup</option>
            <option value="dropoff">Drop-off</option>
          </select>
          <button onClick={createTrip}>Start Trip</button>
        </div>

        <div className="section">
          <h3>Complete Trip</h3>
          <input
            type="number"
            placeholder="Kilometers Covered"
            onChange={e =>
              setTrip({ ...trip, kilometers: +e.target.value })
            }
          />
          <button onClick={completeTrip}>Complete Trip</button>
        </div>

        <div className="section">
          <h3>End Day</h3>
          <input
            type="number"
            placeholder="Fuel Expense"
            onChange={e => setFuel(+e.target.value)}
          />
          <button onClick={endDay}>End Day</button>
        </div>
      </>
    )}

    {log && (
  <div className="stats">
    <div className="card">
      <h4>Pickups</h4>
      <p>{log.pickup}</p>
    </div>

    <div className="card">
      <h4>Drop-offs</h4>
      <p>{log.dropoff}</p>
    </div>

    <div className="card">
      <h4>Total KM</h4>
      <p>{log.km}</p>
    </div>

    <div className="card">
      <h4>Total Earnings</h4>
      <p>₹ {log.earning}</p>
    </div>

    <div className="card">
      <h4>Fuel Expense</h4>
      <p>₹ {log.fuel}</p>
    </div>

    <div className="card">
      <h4>Work Hours</h4>
      <p>{log.workHours.toFixed(2)} hrs</p>
    </div>
  </div>
)}

  </div>
);

  
}

export default App;
