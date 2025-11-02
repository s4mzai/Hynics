"use client";
import React, { useState, useEffect } from "react";

const vehicleModels = [
  "H2-Car 1", "H2-Car 2", "H2-Delivery-Max", "OK Complete",
  "H2-Truck 1", "H2-Survey-X", "H2-Van", "H2-Bus", "H2-Forklift"
];
const vehicleTypes = ["Car", "Truck", "Van", "Bus", "Forklift", "Delivery", "Survey"];
const initialQueueItems = [
  { id: "DR-001", name: "H2-Car 1", type: "Car", status: "Complete", fuel: 3.1, eta: 0 },
  { id: "DR-002", name: "H2-Car 2", type: "Car", status: "In Progress", fuel: 3.1, eta: 5 },
  { id: "DR-003", name: "H2-Delivery-Max", type: "Delivery", status: "Waiting", fuel: 3.1, eta: 8 },
  { id: "DR-004", name: "OK Complete", type: "Car", status: "Waiting", fuel: 5.2, eta: 11 },
  { id: "DR-005", name: "OK Complete", type: "Car", status: "Waiting", fuel: 3.1, eta: 15 },
  { id: "DR-006", name: "H2-Truck 1", type: "Truck", status: "Waiting", fuel: 3.1, eta: 19 },
  { id: "DR-007", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 5.2, eta: 22 },
  { id: "DR-008", name: "H2-Survey-X", type: "Survey", status: "Scheduled", fuel: 3.1, eta: 25 },
  { id: "DR-009", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 3.1, eta: 29 },
  { id: "DR-010", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 6.8, eta: 33 }
];

function getStatusColor(status) {
  switch (status) {
    case "Complete": return "bg-green-900 text-green-300";
    case "In Progress": return "bg-blue-900 text-blue-300";
    case "Waiting": return "bg-yellow-900 text-yellow-300";
    case "Scheduled": return "bg-purple-900 text-purple-300";
    default: return "bg-gray-700 text-gray-300";
  }
}

export default function Queue() {
  const [queue, setQueue] = useState(initialQueueItems);
  const [systemStatus, setSystemStatus] = useState({
    status: "online",
    color: "#22c55e",
    text: "System Online"
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "", type: "", id: "", fuel: 0, eta: 0, status: ""
  });

  const openAddModal = () => {
    setNewVehicle({ name: "", type: "", id: "", fuel: 0, eta: 0, status: "" });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedVehicle = { ...newVehicle, [name]: value };
    if (name === "fuel") {
      const fuelValue = parseFloat(value) || 0;
      updatedVehicle.eta = Math.ceil(fuelValue / 0.8);
    }
    setNewVehicle(updatedVehicle);
  };

  const addNewVehicle = () => {
    if (!newVehicle.name || !newVehicle.type || !newVehicle.id || newVehicle.fuel <= 0) {
      alert("Please fill all fields with valid values");
      return;
    }
    setQueue(prev => [
      ...prev,
      { ...newVehicle, status: "Scheduled", fuel: parseFloat(String(newVehicle.fuel)) }
    ]);
    setIsModalOpen(false);
  };

  const removeCompleted = () => {
    setQueue(prev => prev.filter(item => item.status !== "Complete"));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setQueue(prev => {
        const newQueue = [...prev];
        newQueue.forEach(item => {
          if (item.status !== "Complete" && item.status !== "Scheduled" && item.eta > 0) {
            item.eta = Math.max(0, item.eta - 1);
          }
        });
        const inProgressIndex = newQueue.findIndex(item => item.status === "In Progress");
        if (inProgressIndex !== -1 && newQueue[inProgressIndex].eta === 0) {
          newQueue[inProgressIndex].status = "Complete";
          const nextWaitingIndex = newQueue.findIndex(item => item.status === "Waiting");
          if (nextWaitingIndex !== -1) {
            newQueue[nextWaitingIndex].status = "In Progress";
          }
        }
        if (inProgressIndex === -1 || newQueue[inProgressIndex].eta === 0) {
          const waitingCount = newQueue.filter(item => item.status === "Waiting").length;
          if (waitingCount < 3) {
            const nextScheduledIndex = newQueue.findIndex(item => item.status === "Scheduled");
            if (nextScheduledIndex !== -1) {
              newQueue[nextScheduledIndex].status = "Waiting";
            }
          }
        }
        return newQueue;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused]);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      if (isPaused) return;
      const random = Math.random();
      if (random > 0.95) {
        setSystemStatus({ status: "critical", color: "#ef4444", text: "System Critical" });
      } else if (random > 0.9) {
        setSystemStatus({ status: "warning", color: "#fbbf24", text: "System Warning" });
      } else {
        setSystemStatus({ status: "online", color: "#22c55e", text: "System Online" });
      }
    }, 10000);
    return () => clearInterval(statusInterval);
  }, [isPaused]);

  return (
    <div className="bg-[rgba(31,33,33,1)] text-gray-100 min-h-dvh pt-45 p-6">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgba(38,40,40,1)] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-white">Add New Vehicle</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={newVehicle.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="e.g., H2-Car 1"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Vehicle Type</label>
                <select
                  name="type"
                  value={newVehicle.type}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="">Select Type</option>
                  {vehicleTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Vehicle ID</label>
                <input
                  type="text"
                  name="id"
                  value={newVehicle.id}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="e.g., DR-011"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Fuel Needed (kg)</label>
                <input
                  type="number"
                  name="fuel"
                  value={newVehicle.fuel}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="Enter fuel in kg"
                  min={0.1}
                  step={0.1}
                />
              </div>
              <div className="bg-gray-800 p-3 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-300">Estimated ETA</span>
                  <span className="text-lg font-bold text-white">{newVehicle.eta} minutes</span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Calculated: Fuel 0.8 kg per minute
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium">
                Cancel
              </button>
              <button onClick={addNewVehicle} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg font-medium">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1 text-white">Refueling Queue</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={openAddModal} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
            Add to Queue
          </button>
          <button onClick={() => setIsPaused(!isPaused)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPaused ? "bg-green-700 hover:bg-green-600" : "bg-yellow-700 hover:bg-yellow-600"}`}>
            {isPaused ? "Resume Queue" : "Pause Queue"}
          </button>
          <button onClick={removeCompleted} className="px-3 py-1.5 bg-red-700 hover:bg-red-600 rounded-lg text-sm font-medium transition-colors">
            Remove Completed
          </button>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: systemStatus.color }}></div>
          <span className="text-gray-300">{systemStatus.text}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {queue.map(item => (
          <div
            key={item.id}
            className={`bg-[rgba(38,40,40,1)] rounded-lg p-4 shadow-lg border-l-4 ${item.status === "Complete"
              ? "border-green-500"
              : item.status === "In Progress"
                ? "border-blue-500"
                : item.status === "Waiting"
                  ? "border-yellow-500"
                  : "border-purple-500"
              } transition-all duration-300 hover:scale-105`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <div className="text-sm text-gray-400">{item.type}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>{item.status}</span>
            </div>
            <div className="text-sm text-gray-400 mb-1">ID: {item.id}</div>
            <div className="mt-3 space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-400">Fuel Needed</span>
                <span className="font-medium text-white">{item.fuel} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">ETA</span>
                <span className="font-medium text-white">
                  {item.eta} min{item.eta !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[rgba(38,40,40,1)] rounded-lg p-4">
          <div className="text-gray-400">Total Vehicles</div>
          <div className="text-2xl font-bold text-white">{queue.length}</div>
        </div>
        <div className="bg-[rgba(38,40,40,1)] rounded-lg p-4">
          <div className="text-gray-400">In Progress</div>
          <div className="text-2xl font-bold text-blue-400">{queue.filter(item => item.status === "In Progress").length}</div>
        </div>
        <div className="bg-[rgba(38,40,40,1)] rounded-lg p-4">
          <div className="text-gray-400">Waiting</div>
          <div className="text-2xl font-bold text-yellow-400">{queue.filter(item => item.status === "Waiting").length}</div>
        </div>
        <div className="bg-[rgba(38,40,40,1)] rounded-lg p-4">
          <div className="text-gray-400">Scheduled</div>
          <div className="text-2xl font-bold text-purple-400">{queue.filter(item => item.status === "Scheduled").length}</div>
        </div>
      </div>
    </div>
  );
}
