"use client"
import React from 'react';
import { useState } from 'react';
import { useSensorData } from '@/components/pages/PressureTemperatureMonitoring';

const HRSVisuals = () => {
  const problems = [
    'Problem statement 1',
    'Problem statement 2',
    'Problem statement 3',
    'Problem statement 4',
    'Problem statement 5',
    'Problem statement 6',
  ];

  const [selected, setSelected] = useState(null);
  const sensors = useSensorData();

  return (
    <>
      <style>{`.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; } .hide-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      <div className="w-full min-h-dvh pt-45 bg-[rgba(31,_33,_33,_1)] text-gray-100 p-6">
      <div className="flex gap-6 items-start">
        {/* Left: main column fills available height */}
        <div className="flex-1 flex flex-col gap-4 h-[calc(100vh-5.5rem)]">
          {/* Upper: sensor/navbar-like header */}
          <div className="bg-[rgba(38,_40,_40,_1)] rounded-2xl p-4 shadow-xl border border-gray-700">
            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold text-white">HRS</h2>
                <div className="text-sm text-gray-300">Hydrogen Refuelling System</div>
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Leakage:</span>
                  <div className="flex gap-2">
                    {sensors.leakageSensors && sensors.leakageSensors.map((v, idx) => (
                      <span key={idx} className={`px-2 py-1 rounded-full text-sm font-medium ${v > 0.007 ? 'bg-red-600 text-white' : 'bg-green-700 text-white'}`}>
                        S{idx+1}: {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Exhaust:</span>
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">{sensors.exhaustFan}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Flow:</span>
                  <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-700 text-white">{sensors.flowRate} kg/min</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">Flame:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${sensors.flameSensors && sensors.flameSensors.some(Boolean) ? 'bg-red-600 text-white' : 'bg-green-700 text-white'}`}>
                    {sensors.flameSensors ? (sensors.flameSensors.some(Boolean) ? 'FLAME' : 'SAFE') : '-'}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <span className="text-sm text-gray-300">Valves:</span>
                  <div className="flex gap-2 flex-wrap">
                    {sensors.valvePositions && sensors.valvePositions.map((v, i) => (
                      <span key={i} className={`px-2 py-1 rounded-full text-sm font-medium ${v ? 'bg-green-700 text-white' : 'bg-gray-600 text-gray-200'}`}>
                        V{i+1}: {v ? 'OPEN' : 'CLOSED'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lower: screen area that shows selected problem text, fills remaining space */}
          <div className="flex-1 bg-[rgba(38,_40,_40,_1)] rounded-lg p-4 overflow-hidden border border-gray-700">
            <h2 className="text-lg font-semibold text-white mb-3">Problem Screen</h2>
            <div className="h-full rounded-md bg-[rgba(31,_33,_33,_1)] flex items-center justify-center text-gray-400 p-4 overflow-auto border border-gray-700">
              {selected ? (
                <div className="text-center">
                  <div className="text-2xl font-bold text-white mb-3">{selected}</div>
                  <div className="text-sm text-gray-300">Details panel — placeholder for video or explanation.</div>
                </div>
              ) : (
                <div className="text-gray-400">No problem selected. Click a problem on the right.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right: 25% ghost buttons */}
        <div className="w-1/4 flex-none">
          <div className="bg-[rgba(38,_40,_40,_1)] rounded-lg p-4 h-[calc(100vh-5.5rem)] overflow-hidden">
            <h3 className="text-lg font-semibold text-white mb-3">Problem Statements</h3>
            <div className="flex flex-col gap-2 h-full">
              <div className="overflow-y-auto pr-1 hide-scrollbar">
              {problems.map((p, i) => (
                <button
                  key={p}
                  onClick={() => setSelected(p)}
                  className={`w-full text-left py-2 px-3 rounded transition-colors hover:bg-gray-700/40 hover:text-white text-gray-300 whitespace-normal break-words ${
                    selected === p ? 'bg-gray-700/60 text-white' : 'bg-transparent'
                  }`}
                >
                  {p}
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default HRSVisuals;
