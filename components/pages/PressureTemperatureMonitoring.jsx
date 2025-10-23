"use client";

import React, { useState, useEffect } from "react";
import Temp from "../Temp";

const PressureTemperatureMonitoring = () => {
  // 🧱 Initial Cascade Tanks
  const initialTanks = [
    { id: "Cascade-1", pressure: 285, mass: 5.9, fill: 82.6, temperature: 28.4 },
    { id: "Cascade-2", pressure: 312, mass: 6.3, fill: 90.0, temperature: 31.2 },
    { id: "Cascade-3", pressure: 298, mass: 6.1, fill: 84.4, temperature: 29.7 },
    { id: "Temporary Tank Cascade", pressure: 335, mass: 8.9, fill: 89.4, temperature: 30.1 },
  ];

  const [tanks, setTanks] = useState(initialTanks);

  // 🧭 Sensor Data
  const [sensors, setSensors] = useState({
    leakageSensors: [0.002, 0.004, 0.007],
    exhaustFan: "ON",
    flowRate: 0.45,
    flameSensors: [false, false, false],
    valvePositions: [true, true, false, false],
    emergencyLight: false,
  });

  // 🎨 Pressure color
  const getPressureColor = (pressure, maxPressure) => {
    const percentage = (pressure / maxPressure) * 100;
    if (percentage > 90) return "bg-red-500";
    if (percentage > 70) return "bg-yellow-400";
    return "bg-green-500";
  };

  // ⚙️ Live Update Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTanks((prev) =>
        prev.map((tank, i) => {
          const maxPressure = i === 3 ? 600 : 350;
          const maxMass = i === 3 ? 10.0 : 7.0;
          const pressureChange = (Math.random() * 10) - 5;
          const massChange = (Math.random() * 0.3) - 0.1;
          const tempChange = (Math.random() * 0.6) - 0.3;

          let newPressure = Math.max(100, Math.min(maxPressure, tank.pressure + pressureChange));
          let newMass = Math.max(3.0, Math.min(maxMass, tank.mass + massChange));
          let newTemp = Math.max(20, Math.min(40, tank.temperature + tempChange));
          const newFill = Math.min(100, ((newMass / maxMass) * 100).toFixed(1));

          return {
            ...tank,
            pressure: +newPressure.toFixed(1),
            mass: +newMass.toFixed(2),
            fill: +newFill,
            temperature: +newTemp.toFixed(1),
          };
        })
      );

      const newLeakage = Array.from({ length: 3 }, () => +(Math.random() * 0.01).toFixed(3));
      const anyLeak = newLeakage.some((val) => val > 0.007);
      const anyFlame = sensors.flameSensors.some(Boolean);

      setSensors({
        leakageSensors: newLeakage,
        exhaustFan: Math.random() > 0.5 ? "ON" : "OFF",
        flowRate: +(Math.random() * 1.2).toFixed(2),
        flameSensors: Array.from({ length: 3 }, () => Math.random() > 0.7),
        valvePositions: Array.from({ length: 4 }, () => Math.random() > 0.5),
        emergencyLight: anyLeak || anyFlame,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#1f2121] text-gray-100 pt-45 px-6 flex flex-col gap-5 py-10">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-white mb-10 text-center tracking-wide">
          Hydrogen Dispenser Monitoring Panel
        </h1>

        {/* 🧱 Cascade Tanks */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tanks.map((tank, i) => (
            <div
              key={tank.id}
              className="bg-[#262828] rounded-2xl p-5 shadow-xl border border-gray-700 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="font-mono text-lg font-semibold text-white mb-3 border-b border-gray-600 pb-1 text-center">
                {tank.id}
              </h2>

              {/* Pressure */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">Pressure</span>
                  <span className="font-bold text-white">{tank.pressure} bar</span>
                </div>
                <div className="w-full bg-[#1f2121] rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 ${getPressureColor(
                      tank.pressure,
                      i === 3 ? 600 : 350
                    )} transition-all duration-500`}
                    style={{
                      width: `${(tank.pressure / (i === 3 ? 600 : 350)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Mass, Fill, Temp */}
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Mass</span>
                <span className="font-bold">{tank.mass} kg</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">Fill</span>
                <span className="font-bold">{tank.fill}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">Temperature</span>
                <span className="font-bold text-blue-400">{tank.temperature} °C</span>
              </div>
            </div>
          ))}
        </div>

        {/* ⚙️ Sensor Monitoring */}
        <div className="w-full max-w-6xl bg-[#262828] rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex items-center justify-between mb-6 border-b border-gray-600 pb-3">
            <h2 className="text-2xl font-semibold text-white">Sensor Monitoring</h2>

            {/* Emergency Light */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-sm">Emergency Light:</span>
              <div
                className={`w-6 h-6 rounded-full shadow-lg ${
                  sensors.emergencyLight
                    ? "bg-red-500 shadow-red-500/50 animate-pulse"
                    : "bg-gray-500"
                }`}
              ></div>
            </div>
          </div>

          {/* Sensor Groups */}
          <div className="flex justify-center flex-wrap gap-3 ">

            {/* Hydrogen Leakage */}
            <div className="bg-[#1f2121] rounded-xl p-4 shadow-md border border-gray-700 w-85">
              <h3 className="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">
                Hydrogen Leakage
              </h3>
              {sensors.leakageSensors.map((val, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>Sensor {i + 1}</span>
                  <span className={`font-bold ${val > 0.007 ? "text-red-400" : "text-green-400"}`}>
                    {val} ppm
                  </span>
                </div>
              ))}
            </div>

            {/* Exhaust & Flow */}
            <div className="bg-[#1f2121] rounded-xl p-4 shadow-md border border-gray-700 w-85">
              <h3 className="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">
                Exhaust & Flow
              </h3>
              <div className="flex justify-between text-sm mb-1">
                <span>Exhaust Fan</span>
                <span
                  className={`font-bold ${
                    sensors.exhaustFan === "ON" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {sensors.exhaustFan}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Flow Rate</span>
                <span className="font-bold text-white">{sensors.flowRate} kg/min</span>
              </div>
            </div>

            {/* Flame Sensors */}
            <div className="bg-[#1f2121] rounded-xl p-4 shadow-md border border-gray-700 w-85">
              <h3 className="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">
                Flame Detection
              </h3>
              {sensors.flameSensors.map((val, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>Flame Sensor {i + 1}</span>
                  <span className={`font-bold ${val ? "text-red-400" : "text-green-400"}`}>
                    {val ? "FLAME DETECTED" : "SAFE"}
                  </span>
                </div>
              ))}
            </div>

            {/* Valve Positions */}
            <div className="bg-[#1f2121] rounded-xl p-4 shadow-md border border-gray-700 w-85">
              <h3 className="text-lg font-semibold mb-2 text-gray-200 border-b border-gray-700 pb-1">
                Valve Positions
              </h3>
              {sensors.valvePositions.map((val, i) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>Valve {i + 1}</span>
                  <span className={`font-bold ${val ? "text-green-400" : "text-gray-400"}`}>
                    {val ? "OPEN" : "CLOSED"}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      <Temp/>
      
    </div>
  );
};

export default PressureTemperatureMonitoring;
