"use client";
import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// const vehicleModels = [
//   "H2-Car 1", "H2-Car 2", "H2-Delivery-Max", "OK Complete",
//   "H2-Truck 1", "H2-Survey-X", "H2-Van", "H2-Bus", "H2-Forklift"
// ];

const vehicleTypes = ["Car", "Truck", "Van", "Bus", "Forklift", "Delivery", "Survey"];
const paymentModes = ["Cash", "Card", "Online Transfer", "Wallet", "Credit"];
const PRICE_PER_KG = 50;
const initialQueueItems = [
  { id: "TEST-001", name: "Test Vehicle", type: "Car", status: "Waiting", fuel: 5.0, eta: 6, driverName: "Test Driver", carNumber: "TEST-123", amountToFill: 5.0, paymentMode: "Cash" }
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

export default function FillingControl() {
  const [queue, setQueue] = useState(initialQueueItems);
  const [activeTab, setActiveTab] = useState("queue");
  const [selectedVehicleId, setSelectedVehicleId] = useState("TEST-001");
  const [fillingData, setFillingData] = useState({
    vehicleId: "TEST-001",
    vehicleName: "Test Vehicle",
    percentageFilled: 0,
    massFilled: 0,
    totalMass: 5.0,
    driverName: "Test Driver",
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
  const [isBillModalOpen, setIsBillModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentInvoiceNumber, setCurrentInvoiceNumber] = useState("");
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);
  const [isDispensing, setIsDispensing] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: "", type: "", id: "", fuel: 0, eta: 0, status: "", driverName: "", carNumber: "", amountToFill: 0, paymentMode: ""
  });

  const openAddModal = () => {
    setNewVehicle({ name: "", type: "", id: "", fuel: 0, eta: 0, status: "", driverName: "", carNumber: "", amountToFill: 0, paymentMode: "" });
    setIsModalOpen(true);
  };

  const openBillModal = () => {
    setIsBillModalOpen(true);
  };

  const closeBillModal = () => {
    setIsBillModalOpen(false);
  };

  const openPreviewModal = () => {
    // Generate invoice number once and store it
    const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
    setCurrentInvoiceNumber(invoiceNumber);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  const generatePDF = () => {
    try {
      // Get the selected vehicle to get car number
      const selectedVehicle = queue.find(v => v.id === selectedVehicleId);
      const carNumber = selectedVehicle ? selectedVehicle.carNumber : "Car number not provided";
      
      const pdf = new jsPDF();
      
      // Set font sizes and colors
      pdf.setFontSize(20);
      pdf.setTextColor(0, 0, 0);
      
      // Title
      pdf.text("Fuel Station Invoice", 105, 20, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.text("Hydrogen Fueling Station", 105, 30, { align: "center" });
      
      // Date and Invoice Number
      const today = new Date();
      const date = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getFullYear()).toString().slice(-2)}`;
      pdf.setFontSize(10);
      pdf.text(`Date: ${date}`, 20, 50);
      pdf.text(`Invoice #: ${currentInvoiceNumber}`, 150, 50);
      
      // Customer Information
      pdf.setFontSize(12);
      pdf.text("Bill To:", 20, 70);
      pdf.setFontSize(10);
      pdf.text(`Driver: ${fillingData.driverName}`, 20, 80);
      pdf.text("Address: Address not provided", 20, 90);
      pdf.text(`GST: GST not provided`, 20, 100);
      
      // Vehicle Information
      pdf.text("Vehicle Details:", 120, 70);
      pdf.text(`Vehicle: ${fillingData.vehicleName}`, 120, 80);
      pdf.text(`Vehicle ID: ${fillingData.vehicleId}`, 120, 90);
      pdf.text(`Vehicle Number: ${carNumber}`, 120, 100);
      pdf.text(`Payment Mode: ${fillingData.paymentMode}`, 120, 110);
      
      // Table Headers
      pdf.setFillColor(200, 200, 200);
      pdf.rect(20, 130, 170, 10, "F");
      pdf.setFontSize(10);
      pdf.text("Description", 25, 137);
      pdf.text("Quantity", 100, 137);
      pdf.text("Rate", 140, 137);
      pdf.text("Amount", 170, 137);
      
      // Table Content
      pdf.text("Hydrogen Fuel", 25, 155);
      pdf.text(`${fillingData.massFilled.toFixed(2)} kg`, 100, 155);
      pdf.text(`₹${PRICE_PER_KG}`, 140, 155);
      pdf.text(`₹${(fillingData.massFilled * PRICE_PER_KG).toFixed(2)}`, 170, 155);
      
      // Line
      pdf.line(20, 165, 190, 165);
      
      // Totals
      pdf.text("Subtotal:", 140, 180);
      pdf.text(`₹${(fillingData.massFilled * PRICE_PER_KG).toFixed(2)}`, 170, 180);
      
      pdf.text("Tax (10%):", 140, 190);
      pdf.text(`₹${((fillingData.massFilled * PRICE_PER_KG) * 0.1).toFixed(2)}`, 170, 190);
      
      pdf.setFontSize(12);
      pdf.text("Total:", 140, 200);
      pdf.text(`₹${calculateBill().total.toFixed(2)}`, 170, 200);
      
      // Footer
      pdf.setFontSize(10);
      pdf.text("Thank you for your business!", 105, 230, { align: "center" });
      pdf.text("Terms and Conditions Apply", 105, 240, { align: "center" });
      
      // Save the PDF
      pdf.save(`H2-Invoice-${currentInvoiceNumber}.pdf`);
      closePreviewModal();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
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
    
    const existingVehicle = queue.find(item => item.id === newVehicle.id);
    if (existingVehicle) {
      alert("Vehicle ID already exists. Please use a different ID.");
      return;
    }
    
    const vehicleToAdd = {
      id: newVehicle.id.trim(),
      name: newVehicle.name.trim(),
      type: newVehicle.type,
      status: "Scheduled",
      fuel: parseFloat(String(newVehicle.fuel)),
      eta: Math.ceil(parseFloat(String(newVehicle.fuel)) / 0.8),
      driverName: newVehicle.driverName.trim(),
      carNumber: newVehicle.carNumber.trim(),
      amountToFill: parseFloat(String(newVehicle.fuel)),
      paymentMode: newVehicle.paymentMode
    };
    
    setQueue(prev => [...prev, vehicleToAdd]);
    setIsModalOpen(false);
  };

  const removeCompleted = () => {
    setQueue(prev => prev.filter(item => item.status !== "Complete"));
  };

  const generateBill = () => {
    openBillModal();
  };

  const startDispensing = () => {
    setIsDispensing(true);
    setFillingData(prev => ({
      ...prev,
      percentageFilled: 0,
      massFilled: 0
    }));
    setQueue(prev => prev.map(item => 
      item.id === selectedVehicleId && item.status !== "Complete"
        ? { ...item, status: "In Progress" }
        : item
    ));
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      if (isDispensing) {
        setFillingData(prev => {
          if (prev.percentageFilled >= 100) {
            setIsDispensing(false);
            setQueue(prevQueue => prevQueue.map(item => 
              item.id === prev.vehicleId
                ? { ...item, status: "Complete" }
                : item
            ));
            return { ...prev, percentageFilled: 100, massFilled: prev.totalMass };
          }
          const newPercentage = Math.min(100, prev.percentageFilled + Math.random() * 20);
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
      
      setSystemData(prev => ({
        tankPressure: Math.max(250, Math.min(350, prev.tankPressure + (Math.random() * 10 - 5))),
        h2Temperature: Math.max(25, Math.min(40, prev.h2Temperature + (Math.random() * 2 - 1))),
        h2Purity: Math.max(95, Math.min(100, prev.h2Purity + (Math.random() * 0.5 - 0.25))),
        leakageDetection: Math.max(0, Math.min(0.01, prev.leakageDetection + (Math.random() * 0.004 - 0.002)))
      }));
    }, 2000);
    return () => clearInterval(statusInterval);
  }, [isPaused]);

  const calculateBill = () => {
    const basePrice = fillingData.massFilled * PRICE_PER_KG;
    const tax = basePrice * 0.1;
    const total = basePrice + tax;
    return { basePrice, tax, total };
  };

  const handleVehicleSelect = (vehicleId) => {
    setSelectedVehicleId(vehicleId);
    setIsDispensing(false);
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
          <div className="bg-[rgba(38,40,40,1)] rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-white">Add New Vehicle</h2>
            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Vehicle Details</h3>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Vehicle Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newVehicle.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g., H2-Car 1"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Vehicle Type</label>
                  <select
                    name="type"
                    value={newVehicle.type}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Vehicle ID</label>
                  <input
                    type="text"
                    name="id"
                    value={newVehicle.id}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g., DR-011"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Fuel Needed (kg)</label>
                  <input
                    type="number"
                    name="fuel"
                    value={newVehicle.fuel}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter fuel in kg"
                    min={0.1}
                    step={0.1}
                  />
                </div>
                <div className="bg-gray-800 p-4 rounded">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Estimated ETA</span>
                    <span className="text-lg font-bold text-white">{newVehicle.eta} minutes</span>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    Calculated: Fuel 0.8 kg per minute
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Driver & Payment Details</h3>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Driver Name</label>
                  <input
                    type="text"
                    name="driverName"
                    value={newVehicle.driverName}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g., John Smith"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Car Number</label>
                  <input
                    type="text"
                    name="carNumber"
                    value={newVehicle.carNumber}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="e.g., ABC-1234"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Payment Mode</label>
                  <select
                    name="paymentMode"
                    value={newVehicle.paymentMode}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                  >
                    <option value="">Select Payment Mode</option>
                    {paymentModes.map((mode, index) => (
                      <option key={index} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-sm">
                Cancel
              </button>
              <button onClick={addNewVehicle} className="px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg font-medium text-sm">
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}

      {isBillModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[rgba(38,40,40,1)] rounded-lg p-6 w-full max-w-4xl">
            <h2 className="text-xl font-bold mb-6 text-white">Generate Bill</h2>
            <div className="flex gap-6">
              {/* First Component - Bill Details */}
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-blue-400 mb-3">Bill Details</h3>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Driver Name</label>
                  <input
                    type="text"
                    defaultValue={fillingData.driverName}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Driver Name"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Driver Address</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter Driver Address"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">GST Number</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter GST Number"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Fuel Rate (₹/kg)</label>
                  <input
                    type="number"
                    defaultValue={PRICE_PER_KG}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter fuel rate"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Tax Rate (%)</label>
                  <input
                    type="number"
                    defaultValue={10}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter tax rate"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1 text-sm">Discount (%)</label>
                  <input
                    type="number"
                    defaultValue={0}
                    className="w-full bg-gray-700 rounded px-3 py-2 text-white text-sm"
                    placeholder="Enter discount"
                  />
                </div>
              </div>

              {/* Second Component - Bill Preview */}
              <div className="flex-1 space-y-4">
                <h3 className="text-lg font-semibold text-green-400 mb-3">Bill Preview</h3>
                <div className="bg-gray-800 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Vehicle</span>
                    <span className="text-white font-medium">{fillingData.vehicleName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Fuel Quantity</span>
                    <span className="text-white font-medium">{fillingData.massFilled.toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Fuel Amount</span>
                    <span className="text-white font-medium">₹{(fillingData.massFilled * PRICE_PER_KG).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300 text-sm">Tax (10%)</span>
                    <span className="text-white font-medium">₹{((fillingData.massFilled * PRICE_PER_KG) * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300 font-semibold">Total Amount</span>
                      <span className="text-green-400 font-bold text-lg">₹{calculateBill().total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={closeBillModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg font-medium text-sm">
                Cancel
              </button>
              <button onClick={openPreviewModal} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium text-sm">
                Preview Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-black">Invoice Preview - {currentInvoiceNumber}</h2>
              <button onClick={closePreviewModal} className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div id="invoice-preview" className="bg-white p-6 rounded-lg text-black space-y-4">
              {/* Invoice Header */}
              <div className="text-center border-b-2 border-gray-300 pb-4">
                <h1 className="text-2xl font-bold">Fuel Station Invoice</h1>
                <p className="text-sm text-gray-600">Hydrogen Fueling Station</p>
              </div>
              
              {/* Date and Invoice Number */}
              <div className="flex justify-between text-sm">
                <div>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString('en-GB')}</p>
                  <p><strong>Invoice #:</strong> {currentInvoiceNumber}</p>
                </div>
              </div>
              
              {/* Customer and Vehicle Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Bill To:</strong></p>
                  <p>Driver: {fillingData.driverName}</p>
                  <p>Address: Address not provided</p>
                  <p>GST: GST not provided</p>
                </div>
                <div>
                  <p><strong>Vehicle Details:</strong></p>
                  <p>Vehicle: {fillingData.vehicleName}</p>
                  <p>Vehicle ID: {fillingData.vehicleId}</p>
                  <p>Vehicle Number: {queue.find(v => v.id === selectedVehicleId)?.carNumber || "Car number not provided"}</p>
                  <p>Payment Mode: {fillingData.paymentMode}</p>
                </div>
              </div>
              
              {/* Invoice Table */}
              <div className="border border-gray-300">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-2 border-b">Description</th>
                      <th className="text-center p-2 border-b">Quantity</th>
                      <th className="text-center p-2 border-b">Rate</th>
                      <th className="text-right p-2 border-b">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">Hydrogen Fuel</td>
                      <td className="text-center p-2">{fillingData.massFilled.toFixed(2)} kg</td>
                      <td className="text-center p-2">₹{PRICE_PER_KG}</td>
                      <td className="text-right p-2">₹{(fillingData.massFilled * PRICE_PER_KG).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Totals */}
              <div className="text-right text-sm space-y-1">
                <p>Subtotal: ₹{(fillingData.massFilled * PRICE_PER_KG).toFixed(2)}</p>
                <p>Tax (10%): ₹{((fillingData.massFilled * PRICE_PER_KG) * 0.1).toFixed(2)}</p>
                <p className="text-lg font-bold">Total: ₹{calculateBill().total.toFixed(2)}</p>
              </div>
              
              {/* Footer */}
              <div className="text-center text-xs text-gray-600 border-t border-gray-300 pt-4">
                <p>Thank you for your business!</p>
                <p>Terms and Conditions Apply</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button onClick={closePreviewModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg font-medium text-sm">
                Close
              </button>
              <button onClick={generatePDF} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-medium text-sm">
                Download Invoice
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
          <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-3 shadow-lg border border-gray-700 h-[500px] flex flex-col">
            <h2 className="text-lg font-bold mb-2 text-white border-b border-gray-600 border-opacity-50 pb-1">Billing Section</h2>
          <div className="mb-3 bg-[rgba(31,33,33,1)] rounded-lg p-4 border border-gray-700 border-opacity-30 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">Current Vehicle</h3>
            <div className="space-y-3 text-sm">
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
          <div className="mb-2 bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-2 border border-blue-700 border-opacity-40 flex-shrink-0">
            <h3 className="text-xs font-semibold text-gray-300 mb-1 border-b border-gray-600 border-opacity-50 pb-1 uppercase tracking-wide">Bill Summary</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Mass Filled</span>
                <span className="text-white text-xs">{fillingData.massFilled.toFixed(2)} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rate per kg</span>
                <span className="text-white text-xs">₹{PRICE_PER_KG}</span>
              </div>
              <div className="border-t border-gray-600 border-opacity-50 pt-1">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">Base Price</span>
                  <span className="text-white text-xs">₹{calculateBill().basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax (10%)</span>
                  <span className="text-white text-xs">₹{calculateBill().tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-green-600 border-opacity-50 pt-1 bg-gradient-to-r from-green-900 to-green-900 bg-opacity-25 rounded-lg px-2 py-1">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-semibold text-xs">Total Bill</span>
                  <span className="text-lg font-bold text-green-400">₹{calculateBill().total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          <button onClick={generateBill} disabled={isDispensing || fillingData.percentageFilled < 100} className="mt-auto w-full bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 disabled:from-blue-800 disabled:to-blue-700 disabled:opacity-75 text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed text-sm">
            {isDispensing ? "Dispensing..." : fillingData.percentageFilled >= 100 ? "Generate Bill" : "Complete Filling First"}
          </button>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex gap-2 mb-4 justify-between">
            <button
              onClick={() => setActiveTab("system")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === "system"
                  ? "bg-blue-700 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              System Status & Filling Control
            </button>
            
            <div className="flex gap-2">
              <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg px-10 py-.5 border border-gray-700 border-opacity-40 shadow-md flex items-center">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mr-2">Total</div>
                <div className="text-lg font-bold text-white">{queue.length}</div>
              </div>
              <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg px-10 py-.5 border border-blue-700 border-opacity-40 shadow-md flex items-center">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mr-2">Progress</div>
                <div className="text-lg font-bold text-blue-400">{queue.filter(item => item.status === "In Progress").length}</div>
              </div>
              <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg px-10 py-.5 border border-yellow-700 border-opacity-40 shadow-md flex items-center">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mr-2">Waiting</div>
                <div className="text-lg font-bold text-yellow-400">{queue.filter(item => item.status === "Waiting").length}</div>
              </div>
              <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg px-10 py-.5 border border-purple-700 border-opacity-40 shadow-md flex items-center">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mr-2">Scheduled</div>
                <div className="text-lg font-bold text-purple-400">{queue.filter(item => item.status === "Scheduled").length}</div>
              </div>
            </div>
          </div>
          {activeTab === "queue" && (
            <div className="flex flex-col bg-[rgba(38,40,40,1)] rounded-lg p-4 shadow-lg border border-gray-700 h-[500px] overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3 flex-shrink-0">
                <div>
                  <h1 className="text-2xl font-bold text-white">Filling Control</h1>
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

              <div className="py-3 px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto flex-1 min-h-[150px]">
                {queue.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleVehicleSelect(item.id)}
                    className={`bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-4 shadow-md border cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-102 ${
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
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white leading-tight">{item.name}</h3>
                        <div className="text-xs text-gray-500 mt-1">{item.type}</div>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(item.status)}`}>{item.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">ID: {item.id}</div>
                    <div className="space-y-1.5 text-sm">
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
                        <div className="mt-2 pt-2 border-t border-blue-400 border-opacity-50">
                          <span className="text-xs text-blue-300 font-semibold">✓ Selected for Billing</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "system" && (
            <div className="flex flex-col gap-3 flex-1">
              <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-2 shadow-lg border border-gray-700">
                <h2 className="text-lg font-bold mb-3 text-white border-b border-gray-600 border-opacity-50 pb-2">System Status</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-3 border border-gray-700 border-opacity-40 shadow-md">
                    <div className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wide">Tank Pressure</div>
                    <div className="text-2xl font-bold text-white mb-1">{systemData.tankPressure.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">bar</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-3 border border-blue-700 border-opacity-30 shadow-md">
                    <div className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wide">H2 Temperature</div>
                    <div className="text-2xl font-bold text-blue-400 mb-1">{systemData.h2Temperature.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">°C</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-3 border border-green-700 border-opacity-30 shadow-md">
                    <div className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wide">H2 Purity</div>
                    <div className="text-2xl font-bold text-green-400 mb-1">{systemData.h2Purity.toFixed(2)}</div>
                    <div className="text-gray-600 text-xs">%</div>
                  </div>
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-xl p-3 border border-gray-700 border-opacity-40 shadow-md">
                    <div className="text-gray-500 text-xs mb-2 font-semibold uppercase tracking-wide">Leakage Detection</div>
                    <div className={`text-2xl font-bold mb-1 ${systemData.leakageDetection > 0.007 ? 'text-red-400' : 'text-green-400'}`}>
                      {systemData.leakageDetection.toFixed(4)}
                    </div>
                    <div className="text-gray-600 text-xs">ppm</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[rgba(38,40,40,1)] to-[rgba(31,33,33,1)] rounded-xl p-3 shadow-lg border border-gray-700">
                <h2 className="text-lg font-bold mb-3 text-white border-b border-gray-600 border-opacity-50 pb-2">Filling Control</h2>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
                  <div className="bg-gradient-to-br from-[rgba(31,33,33,1)] to-[rgba(25,27,27,1)] rounded-lg p-3 flex flex-col justify-center border border-blue-700 border-opacity-30">
                    <h3 className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">Filling Progress</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-500">Percentage Filled</span>
                          <span className="text-xl font-bold text-blue-400">{fillingData.percentageFilled.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 bg-opacity-50 rounded-full h-5 overflow-hidden border border-gray-600 border-opacity-30">
                          <div
                            className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 h-5 rounded-full transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-500/20"
                            style={{ width: `${fillingData.percentageFilled}%` }}
                          >
                            {fillingData.percentageFilled > 10 && (
                              <span className="text-xs font-bold text-white">{fillingData.percentageFilled.toFixed(0)}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-gray-600 border-opacity-50 pt-3">
                        <div className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-2">Mass Filling Progress</div>
                        <div className="space-y-1.5 text-sm">
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
                      className="mt-4 w-full bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 disabled:from-gray-700 disabled:to-gray-600 disabled:opacity-75 text-white font-bold py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
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

