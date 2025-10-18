"use client"
import React, { useState, useEffect } from 'react';

const PressureMonitoring = () => {
  const initialCascadeTanks = [
    { id: 'CT-1', pressure: 297, mass: 5.9, fillStatus: 'standby', fillPercentage: 82.6 },
    { id: 'CT-2', pressure: 337, mass: 6.7, fillStatus: 'active', fillPercentage: 90.0 },
    { id: 'CT-3', pressure: 287, mass: 6.1, fillStatus: 'standby', fillPercentage: 79.4 },
    { id: 'CT-4', pressure: 345, mass: 6.9, fillStatus: 'active', fillPercentage: 96.2 },
    { id: 'CT-5', pressure: 236, mass: 4.7, fillStatus: 'active', fillPercentage: 42.8 },
    { id: 'CT-6', pressure: 289, mass: 6.1, fillStatus: 'active', fillPercentage: 42.8 },
    { id: 'CT-7', pressure: 315, mass: 6.3, fillStatus: 'active', fillPercentage: 42.8 },
    { id: 'CT-8', pressure: 278, mass: 5.9, fillStatus: 'active', fillPercentage: 42.8 },
    { id: 'CT-9', pressure: 336, mass: 6.7, fillStatus: 'active', fillPercentage: 42.8 },
    { id: 'CT-10', pressure: 149, mass: 3.0, fillStatus: 'active', fillPercentage: 42.8 },
  ];

  const initialTemporaryTanks = [
    { id: 'TT-1', pressure: 297, mass: 5.9, fillStatus: 'standby', fillPercentage: 82.6 },
    { id: 'TT-2', pressure: 337, mass: 6.7, fillStatus: 'active', fillPercentage: 90.0 },
    { id: 'TT-3', pressure: 287, mass: 6.1, fillStatus: 'standby', fillPercentage: 79.4 },
    { id: 'TT-4', pressure: 345, mass: 6.9, fillStatus: 'active', fillPercentage: 96.2 },
  ];

  const [cascadeTanks, setCascadeTanks] = useState(initialCascadeTanks);
  const [temporaryTanks, setTemporaryTanks] = useState(initialTemporaryTanks);
  const [systemStatus, setSystemStatus] = useState({
    status: 'online',
    color: '#10B981',
    text: 'System Online'
  });
  const [lastUpdated, setLastUpdated] = useState('');

  const getPressureColor = (pressure, maxPressure) => {
    const percentage = (pressure / maxPressure) * 100;
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  useEffect(() => {
    const updateTanks = () => {
      const now = new Date();
      setLastUpdated(now.toLocaleString());
      
      setCascadeTanks(prev => prev.map(tank => {
        const pressureChange = (Math.random() * 15) - 5;
        let newPressure = tank.pressure + pressureChange;
        const massChange = (Math.random() * 0.3) - 0.1;
        let newMass = tank.mass + massChange;
        newPressure = Math.max(100, Math.min(350, newPressure));
        newMass = Math.max(3.0, Math.min(7.0, newMass));
        const newFillPercentage = Math.min(100, Math.round((newMass / 7.0) * 100 * 10) / 10);
        let newFillStatus = tank.fillStatus;
        if (Math.random() > 0.9) {
          newFillStatus = tank.fillStatus === 'active' ? 'standby' : 'active';
        }
        return {
          ...tank,
          pressure: parseFloat(newPressure.toFixed(1)),
          mass: parseFloat(newMass.toFixed(1)),
          fillStatus: newFillStatus,
          fillPercentage: newFillPercentage
        };
      }));
      
      setTemporaryTanks(prev => prev.map(tank => {
        const pressureChange = (Math.random() * 25) - 10;
        let newPressure = tank.pressure + pressureChange;
        const massChange = (Math.random() * 0.5) - 0.2;
        let newMass = tank.mass + massChange;
        newPressure = Math.max(100, Math.min(600, newPressure));
        newMass = Math.max(3.0, Math.min(10.0, newMass));
        const newFillPercentage = Math.min(100, Math.round((newMass / 10.0) * 100 * 10) / 10);
        let newFillStatus = tank.fillStatus;
        if (Math.random() > 0.9) {
          newFillStatus = tank.fillStatus === 'active' ? 'standby' : 'active';
        }
        return {
          ...tank,
          pressure: parseFloat(newPressure.toFixed(1)),
          mass: parseFloat(newMass.toFixed(1)),
          fillStatus: newFillStatus,
          fillPercentage: newFillPercentage
        };
      }));
    };

    updateTanks();
    const interval = setInterval(updateTanks, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const criticalCascade = cascadeTanks.some(tank => tank.pressure > 330);
    const criticalTemporary = temporaryTanks.some(tank => tank.pressure > 570);
    if (criticalCascade || criticalTemporary) {
      setSystemStatus({
        status: 'critical',
        color: '#EF4444',
        text: 'System Critical (High Pressure)'
      });
    } else {
      setSystemStatus({
        status: 'online',
        color: '#10B981',
        text: 'System Online'
      });
    }
  }, [cascadeTanks, temporaryTanks]);

  return (
    <div className="bg-[rgba(31,_33,_33,_1)] text-gray-100 min-h-screen p-6">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold mb-2 text-white">Tank Pressure & Mass Monitoring</h1>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: systemStatus.color }}></div>
          <span className="text-gray-300">{systemStatus.text}</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-600">Cascade Tanks (350 bar max, 7kg initial weight)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cascadeTanks.map((tank) => (
              <div key={tank.id} className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-4 shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-medium text-white">{tank.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${tank.fillStatus === 'active' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>{tank.fillStatus}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Pressure:</span>
                    <span className="font-bold text-white">{tank.pressure} bar</span>
                  </div>
                  <div className="w-full bg-[rgba(31,_33,_33,_1)] rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${getPressureColor(tank.pressure, 350)}`} style={{ width: `${(tank.pressure / 350) * 100}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Mass:</span>
                  <span className="font-bold text-white">{tank.mass} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Fill:</span>
                  <span className="font-bold text-white">{tank.fillPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-4 pb-2 border-b border-gray-600">Temporary Tanks (600 bar max, 10kg max)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {temporaryTanks.map((tank) => (
              <div key={tank.id} className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-4 shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-mono font-medium text-white">{tank.id}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${tank.fillStatus === 'active' ? 'bg-blue-900 text-blue-300' : 'bg-gray-700 text-gray-300'}`}>{tank.fillStatus}</span>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Pressure:</span>
                    <span className="font-bold text-white">{tank.pressure} bar</span>
                  </div>
                  <div className="w-full bg-[rgba(31,_33,_33,_1)] rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${getPressureColor(tank.pressure, 600)}`} style={{ width: `${(tank.pressure / 600) * 100}%` }}></div>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-300">Mass:</span>
                  <span className="font-bold text-white">{tank.mass} kg</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Fill:</span>
                  <span className="font-bold text-white">{tank.fillPercentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PressureMonitoring;
