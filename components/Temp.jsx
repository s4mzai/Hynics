"use client";
import React, { useState, useEffect } from "react";

const Temp = () => {
  const [sensorData, setSensorData] = useState({
    temperatureSensors: [
      {
        id: "ambient_temp",
        name: "Ambient Temperature",
        description: "Surrounding environmental temperature",
        currentValue: 32,
        maxValue: 40,
        warningLevel: 75,
        unit: "°C",
        category: "primary",
      },
      {
        id: "compressor_temp",
        name: "Compressor Temperature",
        description: "Compression system thermal monitoring",
        currentValue: 67,
        maxValue: 82,
        warningLevel: 75,
        unit: "°C",
        category: "primary",
      },
      {
        id: "dispenser_temp",
        name: "Dispenser Temperature",
        description: "Dispensing equipment thermal control",
        currentValue: 38,
        maxValue: 51,
        warningLevel: 75,
        unit: "°C",
        category: "secondary",
      },
      {
        id: "dispensing_temp",
        name: "Dispensing Temperature",
        description: "Active fuel delivery temperature monitoring",
        currentValue: 72,
        maxValue: 79,
        warningLevel: 75,
        unit: "°C",
        category: "secondary",
      },
    ],
    colorRanges: {
      safe: {
        min: 0,
        max: 65,
        color: "#22c55e",
        label: "Safe Operation",
      },
      caution: {
        min: 66,
        max: 74,
        color: "#fbbf24",
        label: "Caution Zone",
      },
      danger: {
        min: 75,
        max: 999,
        color: "#ef4444",
        label: "Danger Zone",
      },
    },
  });

  const [overallStatus, setOverallStatus] = useState({
    status: "normal",
    color: "#22c55e",
    text: "System Normal",
    dangerCount: 0,
    cautionCount: 0,
  });

  const getTemperatureStatus = (temperature) => {
    const ranges = sensorData.colorRanges;

    if (temperature >= ranges.danger.min) {
      return {
        status: "danger",
        color: ranges.danger.color,
        label: ranges.danger.label,
      };
    } else if (temperature >= ranges.caution.min) {
      return {
        status: "caution",
        color: ranges.caution.color,
        label: ranges.caution.label,
      };
    } else {
      return {
        status: "safe",
        color: ranges.safe.color,
        label: ranges.safe.label,
      };
    }
  };

  const updateOverallStatus = () => {
    let dangerCount = 0;
    let cautionCount = 0;

    sensorData.temperatureSensors.forEach((sensor) => {
      const status = getTemperatureStatus(sensor.currentValue).status;
      if (status === "danger") dangerCount++;
      else if (status === "caution") cautionCount++;
    });

    if (dangerCount > 0) {
      setOverallStatus({
        status: "danger",
        color: "#ef4444",
        text: `System Alert (${dangerCount} Critical)`,
        dangerCount,
        cautionCount,
      });
    } else if (cautionCount > 0) {
      setOverallStatus({
        status: "caution",
        color: "#fbbf24",
        text: `System Caution (${cautionCount} Warning)`,
        dangerCount,
        cautionCount,
      });
    } else {
      setOverallStatus({
        status: "normal",
        color: "#22c55e",
        text: "System Normal",
        dangerCount: 0,
        cautionCount: 0,
      });
    }
  };

  const simulateTemperatureChanges = () => {
    setSensorData((prevData) => {
      const updatedSensors = prevData.temperatureSensors.map((sensor) => {
        const variation = (Math.random() - 0.5) * 4; // ±2°C variation
        let newTemp = sensor.currentValue + variation;

        newTemp = Math.max(20, Math.min(85, newTemp));
        newTemp = Math.round(newTemp * 10) / 10;

        const newMaxValue =
          newTemp > sensor.maxValue ? newTemp : sensor.maxValue;

        return {
          ...sensor,
          currentValue: newTemp,
          maxValue: newMaxValue,
        };
      });

      return {
        ...prevData,
        temperatureSensors: updatedSensors,
      };
    });
  };

  useEffect(() => {
    updateOverallStatus();

    const interval = setInterval(() => {
      simulateTemperatureChanges();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateOverallStatus();
  }, [sensorData]);

  return (
    <div className="flex flex-col bg-[rgba(31,_33,_33,_1)]">
      {/* Header */}
      <header className="bg-[rgba(31,_33,_33,_1)] shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <div className="system-info">
            <h1 className="text-3xl font-bold mb-2 text-white">
              Temperature Monitoring
            </h1>
          </div>
          <div className="overall-status">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm transition-colors duration-300"
                style={{ backgroundColor: overallStatus.color }}
              ></div>
              <span className="text-sm font-medium text-white">
                {overallStatus.text}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sensorData.temperatureSensors.map((sensor) => {
              const status = getTemperatureStatus(sensor.currentValue);
              const borderColor = {
                safe: "border-green-500",
                caution: "border-yellow-500",
                danger: "border-red-500",
              }[status.status];

              return (
                <div
                  key={sensor.id}
                  className={`bg-[rgba(38,_40,_40,_1)] rounded-lg shadow-sm border-l-4 ${borderColor} p-4 transition-colors duration-300`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {sensor.name}
                    </h3>
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: status.color }}
                    ></div>
                  </div>
                  <div
                    className="text-4xl font-bold mb-3"
                    style={{ color: status.color }}
                  >
                    {sensor.currentValue}
                    {sensor.unit}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="metric">
                      <div className="font-medium">Max Recorded</div>
                      <div>
                        {sensor.maxValue}
                        {sensor.unit}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="font-medium">Warning Level</div>
                      <div>
                        {sensor.warningLevel}
                        {sensor.unit}
                      </div>
                    </div>
                    <div className="metric">
                      <div className="font-medium">Status</div>
                      <div>{status.label}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Temp;
