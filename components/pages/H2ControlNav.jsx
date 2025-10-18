"use client"

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const H2ControlNav = () => {
  const [timestamp, setTimestamp] = useState("");
  const [systemStatus, setSystemStatus] = useState({
    status: "online",
    color: "#22c55e",
    text: "System Online",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const dateString = now.toLocaleDateString("en-GB");
      setTimestamp(`${dateString}, ${timeString}`);
    };

    updateTime(); 
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const statusInterval = setInterval(() => {
      const random = Math.random();
      if (random > 0.95) {
        setSystemStatus({
          status: "critical",
          color: "#ef4444",
          text: "System Critical",
        });
      } else if (random > 0.9) {
        setSystemStatus({
          status: "warning",
          color: "#fbbf24",
          text: "System Warning",
        });
      } else {
        setSystemStatus({
          status: "online",
          color: "#22c55e",
          text: "System Online",
        });
      }
    }, 10000);

    return () => clearInterval(statusInterval);
  }, []);

  return (
    <div className="w-full">
      <nav className="bg-[linear-gradient(135deg,_#1e3a5f_0%,_#2c5282_100%)] text-white p-6 flex justify-between items-center border-b-4 border-blue-400">
        <div className="flex items-center">
          

          <div className="flex items-center">
            <img src="/New logo without bg.png" alt="New Logo" className="h-10 md:h-12" />
            <h2 className="text-2xl font-bold text-white mr-4 relative after:content-[''] after:right-[-1rem] after:top-1/2 after:transform after:-translate-y-1/2 after:w-1 after:h-8 after:bg-blue-400">
              H2 Refueling Station Control
            </h2>
          </div>


          {/* <div className="flex items-center">
              <img src={logo} alt="Logo" className="h-10 md:h-12" />
            <h2 className="text-2xl font-bold text-white mr-4 relative after:content-[''] after:right-[-1rem] after:top-1/2 after:transform after:-translate-y-1/2 after:w-1 after:h-8 after:bg-blue-400">
              H2 Refueling Station Control
            </h2>
          </div> */}


        </div>
        <div className="flex items-center space-x-4">
          <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
            EMERGENCY STOP
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: systemStatus.color }}
            ></div>
            <span className="text-cyan-400 bg-gray-700 border border-gray-700 rounded-full px-3 py-1 text-sm font-medium">
              {systemStatus.text} | {timestamp}
            </span>
          </div>
        </div>
      </nav>

      <div className="bg-[rgba(38,_40,_40,_1)] p-2 flex space-x-1 border-b border-gray-700">
        <Link
          to="/LeakDetection"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Leak Detection
        </Link>
        <Link
          to="/Flow"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Flow Measurement
        </Link>
        <Link
          to="/PressureMonitoring"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Pressure
        </Link>
        <Link
          to="/Temperature"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Temperature
        </Link>
        <Link
          to="/Queue"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Queue
        </Link>
        <Link
          to="/SystemControl"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          System Control
        </Link>
        <Link
          to="/Settings"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Settings
        </Link>
        <Link
          to="#system-design"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          System Design
        </Link>
        <Link
          to="#sensor-monitoring"
          className="px-2 py-2 rounded-full text-white hover:bg-[#4b4b4b] hover:text-blue-400 transition-colors font-medium"
        >
          Sensor Monitoring
        </Link>
      </div>
    </div>
  );
};

export default H2ControlNav;
