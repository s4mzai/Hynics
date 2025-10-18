"use client"
import React, { useState } from 'react';

const SystemControl = () => {
  const [equipment, setEquipment] = useState([
    { name: "Main Compressor", status: "Running", indicator: "green", isOn: true },
    { name: "Pressure Booster", status: "Standby", indicator: "yellow", isOn: false },
    { name: "Generator", status: "Off", indicator: "red", isOn: false },
    { name: "Cascade", status: "Running", indicator: "green", isOn: true },
    { name: "Secondary Storage", status: "Running", indicator: "green", isOn: true },
    { name: "Decant Pannel", status: "Running", indicator: "green", isOn: true },
    { name: "Priority Panel", status: "Running", indicator: "green", isOn: true }
  ]);

  const emergencyContacts = [
    { name: "Police", number: "+91 100" },
    { name: "Fire Brigade", number: "+91 101" },
    { name: "Ambulance", number: "+91 103" },
    { name: "Women and Child Helpline", number: "+91 102" }
  ];

  const getIndicatorColor = (color) => {
    switch (color) {
      case "green": return "bg-green-500";
      case "yellow": return "bg-yellow-500";
      case "red": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const toggleEquipment = (index) => {
    const updatedEquipment = [...equipment];
    updatedEquipment[index].isOn = !updatedEquipment[index].isOn;
    updatedEquipment[index].status = updatedEquipment[index].isOn ? "Running" : "Off";
    updatedEquipment[index].indicator = updatedEquipment[index].isOn ? "green" : "red";
    setEquipment(updatedEquipment);
  };

  return (
    <div className="bg-[rgba(31,_33,_33,_1)] text-gray-100 min-h-screen p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-2">Equipment Control & Emergency Systems</h1>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b bg-[rgba(31,_33,_33,_1)]">Equipment Controls</h2>
          <div className="space-y-4">
            {equipment.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[rgba(31,_33,_33,_1)] rounded-lg">
                <h3 className="font-medium">{item.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">{item.status}</span>
                  <div className={`w-3 h-3 rounded-full ${getIndicatorColor(item.indicator)}`}></div>
                  <button
                    onClick={() => toggleEquipment(index)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${item.isOn ? 'bg-blue-500' : 'bg-blue-900'}`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transform ${item.isOn ? 'translate-x-6' : 'translate-x-0'} transition-transform`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b bg-[rgba(31,_33,_33,_1)]">Emergency Contacts</h2>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-[rgba(38,_40,_40,_1)] rounded-lg hover:bg-[rgba(31,_33,_33,_1)] transition-colors">
                <span className="font-bold">{contact.name}</span>
                <a href={`tel:${contact.number.replace(/\s/g, '')}`} className="text-blue-400 hover:text-blue-300 font-mono">
                  {contact.number}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <button className="w-full py-3 bg-red-700 hover:bg-red-600 rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Emergency Shutdown</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemControl;
