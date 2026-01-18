"use client";
import React, { useState, useEffect } from "react";

const vehicleModels = [
  "H2-Car 1", "H2-Car 2", "H2-Delivery-Max", "OK Complete",
  "H2-Truck 1", "H2-Survey-X", "H2-Van", "H2-Bus", "H2-Forklift"
];
const vehicleTypes = ["Car", "Truck", "Van", "Bus", "Forklift", "Delivery", "Survey"];
const paymentModes = ["Cash", "Card", "Online Transfer", "Wallet", "Credit"];
const PRICE_PER_KG = 50;
const initialQueueItems = [
  { id: "DR-001", name: "H2-Car 1", type: "Car", status: "Complete", fuel: 3.1, eta: 0, driverName: "John Smith", carNumber: "ABC-1234", amountToFill: 3.1, paymentMode: "Card" },
  { id: "DR-002", name: "H2-Car 2", type: "Car", status: "In Progress", fuel: 3.1, eta: 5, driverName: "Sarah Johnson", carNumber: "XYZ-5678", amountToFill: 3.1, paymentMode: "Cash" },
  { id: "DR-003", name: "H2-Delivery-Max", type: "Delivery", status: "Waiting", fuel: 3.1, eta: 8, driverName: "Mike Davis", carNumber: "DEF-9012", amountToFill: 3.1, paymentMode: "Online Transfer" },
  { id: "DR-004", name: "OK Complete", type: "Car", status: "Waiting", fuel: 5.2, eta: 11, driverName: "Emily Brown", carNumber: "GHI-3456", amountToFill: 5.2, paymentMode: "Wallet" },
  { id: "DR-005", name: "OK Complete", type: "Car", status: "Waiting", fuel: 3.1, eta: 15, driverName: "James Wilson", carNumber: "JKL-7890", amountToFill: 3.1, paymentMode: "Credit" },
  { id: "DR-006", name: "H2-Truck 1", type: "Truck", status: "Waiting", fuel: 3.1, eta: 19, driverName: "Robert Taylor", carNumber: "MNO-1234", amountToFill: 3.1, paymentMode: "Card" },
  { id: "DR-007", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 5.2, eta: 22, driverName: "Lisa Anderson", carNumber: "PQR-5678", amountToFill: 5.2, paymentMode: "Cash" },
  { id: "DR-008", name: "H2-Survey-X", type: "Survey", status: "Scheduled", fuel: 3.1, eta: 25, driverName: "David Martinez", carNumber: "STU-9012", amountToFill: 3.1, paymentMode: "Online Transfer" },
  { id: "DR-009", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 3.1, eta: 29, driverName: "Jennifer Lee", carNumber: "VWX-3456", amountToFill: 3.1, paymentMode: "Wallet" },
  { id: "DR-010", name: "OK Complete", type: "Car", status: "Scheduled", fuel: 6.8, eta: 33, driverName: "Christopher White", carNumber: "YZA-7890", amountToFill: 6.8, paymentMode: "Credit" }
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
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedVehicleId, setSelectedVehicleId] = useState("DR-002");
  const [fillingData, setFillingData] = useState({
    vehicleId: "DR-002",
    vehicleName: "H2-Car 2",
    percentageFilled: 45,
    massFilled: 1.4,
    totalMass: 3.1,
    driverName: "Sarah Johnson",
    paymentMode: "Cash"
  });
  
  const [systemData, setSystemData] = useState({
    tankPressure: 312,
    h2Temperature: 31.2,
    h2Purity: 99.8,
    leakageDetection: 0.004
  });

  const [systemStatus, setSystemStatus] = useState({
    status: "online",
    color: "#22c55e",
    text: "System Online"
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "", type: "", id: "", fuel: 0, eta: 0, status: "", driverName: "", carNumber: "", amountToFill: 0, paymentMode: ""
  });

  const openAddModal = () => {
    setNewVehicle({ name: "", type: "", id: "", fuel: 0, eta: 0, status: "", driverName: "", carNumber: "", amountToFill: 0, paymentMode: "" });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedVehicle = { ...newVehicle, [name]: value };
    if (name === "fuel") {
      const fuelValue = parseFloat(value) || 0;
      updatedVehicle.eta = Math.ceil(fuelValue / 0.8);
      updatedVehicle.amountToFill = fuelValue;
    }
    setNewVehicle(updatedVehicle);
  };

  const addNewVehicle = () => {
    if (!newVehicle.name || !newVehicle.type || !newVehicle.id || newVehicle.fuel <= 0 || !newVehicle.driverName || !newVehicle.carNumber || !newVehicle.paymentMode) {
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

  const generateBill = () => {
    setIsGeneratingBill(true);
    setTimeout(() => {
      setIsGeneratingBill(false);
    }, 2000);
  };

  const startDispensing = () => {
    setIsDispensing(true);
    // Reset filling progress to 0 when starting
    setFillingData(prev => ({
      ...prev,
      percentageFilled: 0,
      massFilled: 0
    }));
    // Set the selected vehicle status to "In Progress"
    setQueue(prev => prev.map(item => 
      item.id === selectedVehicleId && item.status !== "Complete"
        ? { ...item, status: "In Progress" }
        : item
    ));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      // Update filling progress for selected vehicle only when dispensing
      if (isDispensing) {
        setFillingData(prev => {
          if (prev.percentageFilled >= 100) {
            setIsDispensing(false);
            // Set the vehicle status to "Complete" when filling is done
            setQueue(prevQueue => prevQueue.map(item => 
              item.id === prev.vehicleId
                ? { ...item, status: "Complete" }
                : item
            ));
            return { ...prev, percentageFilled: 100, massFilled: prev.totalMass };
          }
          const newPercentage = Math.min(100, prev.percentageFilled + Math.random() * 3);
          const newMassFilled = (newPercentage / 100) * prev.totalMass;
          return { ...prev, percentageFilled: newPercentage, massFilled: newMassFilled };
        });
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [isPaused, isDispensing]);

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
      
      // Update system data
      setSystemData(prev => ({
        tankPressure: Math.max(250, Math.min(350, prev.tankPressure + (Math.random() * 10 - 5))),
        h2Temperature: Math.max(25, Math.min(40, prev.h2Temperature + (Math.random() * 2 - 1))),
        h2Purity: Math.max(95, Math.min(100, prev.h2Purity + (Math.random() * 0.5 - 0.25))),
        leakageDetection: Math.max(0, Math.min(0.01, prev.leakageDetection + (Math.random() * 0.004 - 0.002)))
      }));
    }, 2000);
    return () => clearInterval(statusInterval);
  }, [isPaused]);

  // Calculate bill
  const calculateBill = () => {
    const basePrice = fillingData.massFilled * PRICE_PER_KG;
    const tax = basePrice * 0.1; // 10% tax
    const total = basePrice + tax;
    return { basePrice, tax, total };
  };

  // Handle vehicle selection from queue
  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsDispensing(false); // Reset dispensing when selecting a new vehicle
    const selectedVehicle = queue.find(v => v.id === vehicleId);
    if (selectedVehicle) {
      setFillingData({
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
        percentageFilled: 0,
        massFilled: 0,
        totalMass: selectedVehicle.fuel,
        driverName: selectedVehicle.driverName,
        paymentMode: selectedVehicle.paymentMode
      });
    }
  };

  return (
    <div className="bg-[rgba(31,33,33,1)] text-gray-100 min-h-dvh pt-45 p-6 flex flex-col">
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
              <div>
                <label className="block text-gray-300 mb-1">Driver Name</label>
                <input
                  type="text"
                  name="driverName"
                  value={newVehicle.driverName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="e.g., John Smith"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  value={newVehicle.carNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="e.g., ABC-1234"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Amount to be Filled (kg)</label>
                <input
                  type="number"
                  name="amountToFill"
                  value={newVehicle.amountToFill}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                  placeholder="Enter amount in kg"
                  min={0.1}
                  step={0.1}
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Payment Mode</label>
                <select
                  name="paymentMode"
                  value={newVehicle.paymentMode}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 rounded px-3 py-2 text-white"
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((mode, index) => (
                    <option key={index} value={mode}>{mode}</option>
                  ))}
                </select>
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

      <div className="flex gap-4 flex-1">
        <div className="w-1/4 flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("queue")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "queue"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Queue
            </button>
            <button onClick={openAddModal} className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
              Add to Queue
            </button>
          </div>
          <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-6 shadow-lg border border-gray-700 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-gray-600 border-opacity-50 pb-4">Billing Section</h2>
          <div className="mb-6 bg-[rgba(31,33,33,1)] rounded-lg p-4 border border-gray-700 border-opacity-30">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Current Vehicle</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle ID</span>
                <span className="text-white font-medium text-xs">{fillingData.vehicleId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Vehicle Name</span>
                <span className="text-white font-medium text-xs">{fillingData.vehicleName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Driver</span>
                <span className="text-white font-medium text-xs">{fillingData.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Mode</span>
                <span className="text-white font-medium text-xs">{fillingData.paymentMode}</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-4 border border-blue-700 border-opacity-40">
            <h3 className="text-sm font-semibold text-gray-300 mb-4 border-b border-gray-600 border-opacity-50 pb-3 uppercase tracking-wide">Bill Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Mass Filled</span>
                <span className="text-white">{fillingData.massFilled.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate per kg</span>
                <span className="text-white">₹{PRICE_PER_KG}</span>
              </div>
              <div className="border-t border-gray-600 border-opacity-50 pt-3">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500">Base Price</span>
                  <span className="text-white">₹{calculateBill().basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span className="text-white">₹{calculateBill().tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-green-600 border-opacity-50 pt-3 bg-gradient-to-r from-green-900 to-green-900 bg-opacity-25 rounded-lg px-3 py-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-semibold">Total Bill</span>
                  <span className="text-2xl font-bold text-green-400">₹{calculateBill().total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={generateBill} disabled={isGeneratingBill} className="mt-6 w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-blue-800 disabled:to-blue-700 disabled:opacity-75 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed">
            {isGeneratingBill ? "Generating Bill..." : "Generate Bill"}
          </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("system")}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === "system"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              System Status & Filling Control
            </button>
          </div>
          {activeTab === "queue" && (
            <div className="flex flex-col bg-[rgba(38,40,40,1)] rounded-lg p-6 shadow-lg border border-gray-700 overflow-hidden flex-1 max-h-[calc(130vh-120px)]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4 flex-shrink-0">
                <div>
                  <h1 className="text-3xl font-bold text-white">Refueling Queue</h1>
                </div>
                <div className="flex flex-wrap gap-2">
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

              <div className="py-5 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 mb-6">
                {queue.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleVehicleSelect(item.id)}
                    className={`bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-5 shadow-md border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
                      selectedVehicleId === item.id
                        ? 'ring-2 ring-blue-400 border-blue-400'
                        : item.status === "Complete"
                          ? "border-green-500 border-opacity-50"
                          : item.status === "In Progress"
                            ? "border-blue-500 border-opacity-50"
                            : item.status === "Waiting"
                              ? "border-yellow-500 border-opacity-50"
                              : "border-purple-500 border-opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">{item.type}</div>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-3 font-mono">ID: {item.id}</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Driver</span>
                        <span className="font-medium text-white text-xs">{item.driverName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Car Number</span>
                        <span className="font-medium text-white text-xs">{item.carNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fuel Needed</span>
                        <span className="font-medium text-white">{item.fuel} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Mode</span>
                        <span className="font-medium text-white text-xs">{item.paymentMode}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ETA</span>
                        <span className="font-medium text-white">
                          {item.eta} min{item.eta !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {selectedVehicleId === item.id && (
                        <div className="mt-3 pt-3 border-t border-blue-400 border-opacity-50">
                          <span className="text-xs text-blue-300 font-semibold">✓ Selected for Billing</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 flex-shrink-0">
                <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-5 border border-gray-700 border-opacity-40 shadow-md">
                  <div className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">Total Vehicles</div>
                  <div className="text-3xl font-bold text-white">{queue.length}</div>
                </div>
                <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-5 border border-blue-700 border-opacity-40 shadow-md">
                  <div className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">In Progress</div>
                  <div className="text-3xl font-bold text-blue-400">{queue.filter(item => item.status === "In Progress").length}</div>
                </div>
                <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-5 border border-yellow-700 border-opacity-40 shadow-md">
                  <div className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">Waiting</div>
                  <div className="text-3xl font-bold text-yellow-400">{queue.filter(item => item.status === "Waiting").length}</div>
                </div>
                <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-5 border border-purple-700 border-opacity-40 shadow-md">
                  <div className="text-gray-500 text-xs font-semibold mb-2 uppercase tracking-wide">Scheduled</div>
                  <div className="text-3xl font-bold text-purple-400">{queue.filter(item => item.status === "Scheduled").length}</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "system" && (
            <div className="flex flex-col gap-4 flex-1 max-h-[calc(130vh-120px)]">
              <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-6 shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-5 text-white border-b border-gray-600 border-opacity-50 pb-4">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-5 border border-gray-700 border-opacity-40 shadow-md">
                    <div className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wide">Tank Pressure</div>
                    <div className="text-3xl font-bold text-white mb-1">{systemData.tankPressure.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">bar</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-5 border border-blue-700 border-opacity-30 shadow-md">
                    <div className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wide">H2 Temperature</div>
                    <div className="text-3xl font-bold text-blue-400 mb-1">{systemData.h2Temperature.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">°C</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-5 border border-green-700 border-opacity-30 shadow-md">
                    <div className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wide">H2 Purity</div>
                    <div className="text-3xl font-bold text-green-400 mb-1">{systemData.h2Purity.toFixed(2)}</div>
                    <div className="text-gray-600 text-xs">%</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-5 border border-gray-700 border-opacity-40 shadow-md">
                    <div className="text-gray-500 text-xs mb-3 font-semibold uppercase tracking-wide">Leakage Detection</div>
                    <div className={`text-3xl font-bold mb-1 ${systemData.leakageDetection > 0.007 ? 'text-red-400' : 'text-green-400'}`}>
                      {systemData.leakageDetection.toFixed(4)}
                    </div>
                    <div className="text-gray-600 text-xs">ppm</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-6 shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-5 text-white border-b border-gray-600 border-opacity-50 pb-4">Filling Control</h2>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-5 flex flex-col justify-center border border-blue-700 border-opacity-30">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wide">Filling Progress</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-3">
                          <span className="text-gray-500">Percentage Filled</span>
                          <span className="text-2xl font-bold text-blue-400">{fillingData.percentageFilled.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-6 overflow-hidden border border-gray-600 border-opacity-30">
                          <div
                            className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 h-6 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20"
                            style={{ width: `${fillingData.percentageFilled}%` }}
                          >
                            {fillingData.percentageFilled > 10 && (
                              <span className="text-xs font-bold text-white">{fillingData.percentageFilled.toFixed(0)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-600 border-opacity-50 pt-4">
                        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2.5">Mass Filling Progress</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Filled</span>
                            <span className="text-white font-bold">{fillingData.massFilled.toFixed(2)} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total Required</span>
                            <span className="text-white font-bold">{fillingData.totalMass} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={startDispensing} 
                      disabled={isDispensing || fillingData.percentageFilled >= 100}
                      className="mt-6 w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-600 disabled:opacity-75 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                    >
                      {isDispensing ? "Dispensing..." : fillingData.percentageFilled >= 100 ? "Dispensing Complete" : "Start Dispensing"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
