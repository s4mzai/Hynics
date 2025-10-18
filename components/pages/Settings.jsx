"use client"
import React, { useState } from 'react';

const Settings = () => {
  const [operationMode, setOperationMode] = useState('Automatic');
  const [thresholds, setThresholds] = useState({
    h2Leak: 2.0,
    cascadePressureMax: 94,
    cascadePressureMin: 9,
    secondaryStoragePressureMax: 89,
    secondaryStoragePressureMin: 14,
    cascadeTempMax: 86,
    boosterTempMax: 76,
    controlPanelTempMax: 66,
    dispenserTempMax: 65
  });

  const operationModes = ['Automatic', 'Manual', 'Maintenance', 'Emergency'];

  const handleThresholdChange = (field, value) => {
    setThresholds(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-[rgba(31,_33,_33,_1)] text-gray-100 min-h-screen p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-2">System Operation Settings</h1>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <span className="text-gray-400">System Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-white">Operation Mode</h2>
          <div className="space-y-3">
            {operationModes.map((mode) => (
              <div 
                key={mode}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  operationMode === mode 
                    ? 'bg-blue-700 border border-blue-500' 
                    : 'bg-[rgba(31,_33,_33,_1)] hover:bg-[rgba(50,_52,_52,_1)]'
                }`}
                onClick={() => setOperationMode(mode)}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    operationMode === mode 
                      ? 'border-blue-300 bg-blue-500' 
                      : 'border-gray-400'
                  }`}></div>
                  <span className="font-medium">{mode}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6 pb-2 border-b border-white">Alarm Thresholds</h2>
          <div className="space-y-6">
            <div className="bg-[rgba(31,_33,_33,_0.5)] p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                H₂ Leak Detection (in ppm)
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Warning Threshold</span>
                <input
                  type="number"
                  value={thresholds.h2Leak}
                  onChange={(e) => handleThresholdChange('h2Leak', parseFloat(e.target.value) || 0)}
                  className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-24 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                />
              </div>
            </div>

            <div className="bg-[rgba(31,_33,_33,_0.5)] p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Pressure Thresholds (in bar)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cascade Max</span>
                    <input
                      type="number"
                      value={thresholds.cascadePressureMax}
                      onChange={(e) => handleThresholdChange('cascadePressureMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cascade Min</span>
                    <input
                      type="number"
                      value={thresholds.cascadePressureMin}
                      onChange={(e) => handleThresholdChange('cascadePressureMin', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Secondary Storage Max</span>
                    <input
                      type="number"
                      value={thresholds.secondaryStoragePressureMax}
                      onChange={(e) => handleThresholdChange('secondaryStoragePressureMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Secondary Storage Min</span>
                    <input
                      type="number"
                      value={thresholds.secondaryStoragePressureMin}
                      onChange={(e) => handleThresholdChange('secondaryStoragePressureMin', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[rgba(31,_33,_33,_0.5)] p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-3 flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                Temperature Thresholds (°C)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Cascade Max</span>
                    <input
                      type="number"
                      value={thresholds.cascadeTempMax}
                      onChange={(e) => handleThresholdChange('cascadeTempMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Booster Max</span>
                    <input
                      type="number"
                      value={thresholds.boosterTempMax}
                      onChange={(e) => handleThresholdChange('boosterTempMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Control Panel Max</span>
                    <input
                      type="number"
                      value={thresholds.controlPanelTempMax}
                      onChange={(e) => handleThresholdChange('controlPanelTempMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Dispenser Max</span>
                    <input
                      type="number"
                      value={thresholds.dispenserTempMax}
                      onChange={(e) => handleThresholdChange('dispenserTempMax', parseInt(e.target.value) || 0)}
                      className="bg-[rgba(31,_33,_33,_1)] border border-gray-700 rounded py-1 px-3 w-20 text-center font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-8 w-full py-3 bg-blue-700 hover:bg-blue-600 rounded-lg font-medium transition-colors flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
