"use client";

import React, { useState, useEffect } from "react";

const HydrogenDispenserMonitor = () => {
  
  // For Cascade Tanks 
  const initialTanks = [
    { id: "Cascade-1", pressure: 285, mass: 5.9, fill: 82.6 },
    { id: "Cascade-2", pressure: 312, mass: 6.3, fill: 90.0 },
    { id: "Cascade-3", pressure: 298, mass: 6.1, fill: 84.4 },
    { id: "Temporary Tank Cascade", pressure: 335, mass: 8.9, fill: 89.4 },
  ];

  const [tanks, setTanks] = useState(initialTanks);

  // For Sensors 
  const [sensors, setSensors] = useState({
    hydrogenLeakage: 0.002,
    exhaustFan: "ON",
    flowRate: 0.45,
    flameSensors: [false, false, false],
    valvePositions: [true, true, false, false],
  });

  // For Pressure Color 
  const getPressureColor = (pressure, maxPressure) => {
    const percentage = (pressure / maxPressure) * 100;
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTanks((prev) =>
        prev.map((tank, i) => {
          const maxPressure = i === 3 ? 600 : 350;
          const maxMass = i === 3 ? 10.0 : 7.0;
          const pressureChange = (Math.random() * 10) - 5;
          const massChange = (Math.random() * 0.3) - 0.1;
          let newPressure = Math.max(100, Math.min(maxPressure, tank.pressure + pressureChange));
          let newMass = Math.max(3.0, Math.min(maxMass, tank.mass + massChange));
          const newFill = Math.min(100, ((newMass / maxMass) * 100).toFixed(1));
          return { ...tank, pressure: +newPressure.toFixed(1), mass: +newMass.toFixed(2), fill: +newFill };
        })
      );

      setSensors({
        hydrogenLeakage: +(Math.random() * 0.01).toFixed(3),
        exhaustFan: Math.random() > 0.5 ? "ON" : "OFF",
        flowRate: +(Math.random() * 1.2).toFixed(2),
        flameSensors: Array.from({ length: 3 }, () => Math.random() > 0.7),
        valvePositions: Array.from({ length: 4 }, () => Math.random() > 0.5),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[rgba(31,_33,_33,_1)] min-h-dvh pt-45 text-gray-100 flex flex-col items-center justify-start py-10 px-6">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Hydrogen Dispenser Monitoring Panel
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {tanks.map((tank, i) => (
          <div
            key={tank.id}
            className="bg-[rgba(38,_40,_40,_1)] rounded-xl p-5 shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            <h2 className="font-mono text-lg font-semibold text-white mb-3 border-b border-gray-600 pb-1">
              {tank.id}
            </h2>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Pressure:</span>
                <span className="font-bold text-white">{tank.pressure} bar</span>
              </div>
              <div className="w-full bg-[rgba(31,_33,_33,_1)] rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getPressureColor(
                    tank.pressure,
                    i === 3 ? 600 : 350
                  )}`}
                  style={{
                    width: `${(tank.pressure / (i === 3 ? 600 : 350)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Mass:</span>
              <span className="font-bold text-white">{tank.mass} kg</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Fill:</span>
              <span className="font-bold text-white">{tank.fill}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sensor Monitoring */}
      <div className="w-full max-w-4xl bg-[rgba(38,_40,_40,_1)] rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-600 pb-2">
          Sensor Monitoring
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-300">Hydrogen Leakage:</span>{" "}
            <span className="font-bold text-white">{sensors.hydrogenLeakage} ppm</span>
          </div>
          <div>
            <span className="text-gray-300">Exhaust Fan:</span>{" "}
            <span
              className={`font-bold ${
                sensors.exhaustFan === "ON" ? "text-green-400" : "text-red-400"
              }`}
            >
              {sensors.exhaustFan}
            </span>
          </div>
          <div>
            <span className="text-gray-300">Flow Rate:</span>{" "}
            <span className="font-bold text-white">{sensors.flowRate} kg/min</span>
          </div>

          {sensors.flameSensors.map((val, idx) => (
            <div key={idx}>
              <span className="text-gray-300">Flame Sensor {idx + 1}:</span>{" "}
              <span className={`font-bold ${val ? "text-red-400" : "text-green-400"}`}>
                {val ? "FLAME DETECTED" : "SAFE"}
              </span>
            </div>
          ))}

          {sensors.valvePositions.map((val, idx) => (
            <div key={idx}>
              <span className="text-gray-300">Valve Position {idx + 1}:</span>{" "}
              <span className={`font-bold ${val ? "text-green-400" : "text-gray-400"}`}>
                {val ? "OPEN" : "CLOSED"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HydrogenDispenserMonitor;
