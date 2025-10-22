"use client"
import React, { useState, useEffect, useRef } from 'react';

const Flow = () => {
  const [timestamp, setTimestamp] = useState('');
  const systemStatus = {
    status: 'online',
    color: '#22c55e',
    text: 'System Online'
  };

  const [flowRates, setFlowRates] = useState([
    { id: 'cascade', label: 'Cascade flow rate', value: 23, unit: 'kg/h' },
    { id: 'secondary', label: 'Secondary tank flow rate', value: 23, unit: 'kg/h' },
    { id: 'booster', label: 'Booster flow rate', value: 17.7, unit: 'kg/h' },
    { id: 'dispensing', label: 'Dispensing flow rate', value: 39.2, unit: 'kg/h' }
  ]);

  const [totalizers, setTotalizers] = useState([
    { id: 'cascade-total', label: 'Cascade', current: 1245.7, max: 1500, currentUnit: 'kg total', maxUnit: 'kg max' },
    { id: 'secondary-total', label: 'Secondary tank', current: 2156.8, max: 3000, currentUnit: 'kg total', maxUnit: 'kg max' },
    { id: 'dispensed-total', label: 'Total Dispensed', current: 938.8, max: null, currentUnit: 'kg total', maxUnit: 'kg max' }
  ]);

  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dateString = now.toLocaleDateString('en-GB');
      setTimestamp(`${dateString}, ${timeString}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsedSeconds = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setFlowRates(prevFlowRates => {
        const updatedFlowRates = prevFlowRates.map(flow => {
          const variation = (Math.random() - 0.5) * 6;
          const newValue = Math.max(10, Math.min(50, flow.value + variation));
          return { ...flow, value: parseFloat(newValue.toFixed(1)) };
        });

        setTotalizers(prevTotalizers => {
          const getFlow = id => updatedFlowRates.find(f => f.id === id)?.value || 0;
          const cascadeFlow = getFlow('cascade');
          const secondaryFlow = getFlow('secondary');
          const dispensingFlow = getFlow('dispensing');

          return prevTotalizers.map(total => {
            let flowRate = 0;
            if (total.id === 'cascade-total') flowRate = cascadeFlow;
            else if (total.id === 'secondary-total') flowRate = secondaryFlow;
            else if (total.id === 'dispensed-total') flowRate = dispensingFlow;

            const increment = flowRate * (elapsedSeconds / 3600);
            const newCurrent = parseFloat((total.current + increment).toFixed(1));
            let newMax = total.max;
            if (newMax !== null && newCurrent > newMax) newMax = newCurrent;

            return { ...total, current: newCurrent, max: newMax };
          });
        });

        return updatedFlowRates;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-dvh pt-45 bg-[rgba(31,_33,_33,_1)] text-gray-100">
      <div className="p-6">

        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Flow Measurement & Totalizers</h1>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: systemStatus.color }}></div>
            <span className="text-gray-300">{systemStatus.text}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-600 text-white">Real-time Flow Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flowRates.map(flow => (
                <div key={flow.id} className="bg-[rgba(31,_33,_33,_1)] rounded-lg p-4 flex flex-col items-center hover:scale-[1.02] transition-all">
                  <p className="text-gray-400 text-sm mb-2">{flow.label}</p>
                  <div className="text-3xl font-bold text-white mb-1">{flow.value.toFixed(1)}</div>
                  <p className="text-gray-400 text-sm">{flow.unit}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6 border-b border-gray-600 text-white">Flow Totalizers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {totalizers.map(total => (
                <div key={total.id} className="bg-[rgba(31,_33,_33,_1)] rounded-lg p-4 flex flex-col items-center hover:scale-[1.02] transition-all">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{total.current.toFixed(1)}</div>
                    <p className="text-gray-400 text-sm">{total.currentUnit}</p>
                    {total.max !== null && (
                      <>
                        <div className="text-xl font-bold text-white mt-2">{total.max.toFixed(1)}</div>
                        <p className="text-gray-400 text-sm">{total.maxUnit}</p>
                      </>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mt-4">{total.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flow;
