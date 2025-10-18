"use client"
import React, { useState, useEffect } from 'react';

const LeakDetection = () => {
  const initialCards = [
    { id: 1, label: 'Primary Storage', value: 1.7, status: 'normal' },
    { id: 2, label: 'Secondary Storage', value: 1.7, status: 'normal' },
    { id: 3, label: 'Compressor Room', value: 2.5, status: 'caution' },
    { id: 4, label: 'Dispenser 1', value: 0.5, status: 'normal' },
    { id: 5, label: 'Vehicle Bay', value: 5.3, status: 'danger' },
  ];

  const [cards, setCards] = useState(initialCards);
  const [systemStatus, setSystemStatus] = useState({
    status: 'operational',
    color: '#10B981', 
    text: 'System Status: Operational'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCards(prevCards => prevCards.map(card => {
        // Generate random fluctuation (-0.5 to +1.0 ppm)
        const fluctuation = (Math.random() * 1.5) - 0.5;
        let newValue = card.value + fluctuation;
        
        // Ensure value doesn't go below 0.1
        newValue = Math.max(0.1, newValue);
        
        // Determine new status based on value
        let newStatus = 'normal';
        if (newValue > 3) {
          newStatus = 'danger';
        } else if (newValue > 1) {
          newStatus = 'caution';
        } else {
          newStatus = 'normal';
        }
        
        return {
          ...card,
          value: parseFloat(newValue.toFixed(1)),
          status: newStatus
        };
      }));
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const dangerCards = cards.filter(card => card.status === 'danger');
    const cautionCards = cards.filter(card => card.status === 'caution');
    
    if (dangerCards.length > 0) {
      setSystemStatus({
        status: 'critical',
        color: '#EF4444', // red
        text: `System Status: CRITICAL (${dangerCards.length} alarms)`
      });
    } else if (cautionCards.length > 0) {
      setSystemStatus({
        status: 'warning',
        color: '#F59E0B', // yellow
        text: `System Status: Warning (${cautionCards.length} cautions)`
      });
    } else {
      setSystemStatus({
        status: 'operational',
        color: '#10B981', // green
        text: 'System Status: Operational'
      });
    }
  }, [cards]);

  return (
    <div className="bg-[rgba(31,_33,_33,_1)] text-gray-100 p-5 min-h-screen">
      <div className="mb-4 bg-[rgba(38,_40,_40,_1)] p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Hydrogen Leak Detection System</h2>
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: systemStatus.color }}
            ></div>
            <span className="text-white">{systemStatus.text}</span>
          </div>
        </div>
        <p className="text-gray-400 mt-2">Real-time monitoring of H₂ concentration levels</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div 
            key={card.id}
            className={`bg-[rgba(38,_40,_40,_1)] rounded-lg p-4 flex flex-col items-center shadow-lg border-l-4 transition-all duration-300 ${
              card.status === 'normal' ? 'border-green-500' : 
              card.status === 'caution' ? 'border-yellow-500' : 
              'border-red-500'
            }`}
          >
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  strokeWidth="8"
                  fill="none"
                  stroke="#374151"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="40%"
                  strokeWidth="8"
                  fill="none"
                  stroke={
                    card.value <= 1 ? '#10B981' : 
                    card.value <= 3 ? '#F59E0B' : 
                    '#EF4444'  
                  }
                  strokeDasharray={251.2} 
                  strokeDashoffset={251.2 - (Math.min(card.value, 5) / 5) * 251.2}
                />
              </svg>
              <div className="absolute text-2xl font-bold text-white">
                {card.value.toFixed(1)}<span className="text-sm font-normal"> ppm</span>
              </div>
            </div>
            
            <p className="text-center font-medium text-gray-100 text-lg mb-1">{card.label}</p>
            
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
              card.status === 'normal' ? 'bg-green-900 text-green-100' : 
              card.status === 'caution' ? 'bg-yellow-900 text-yellow-100' : 
              'bg-red-900 text-red-100'
            }`}>
              {card.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeakDetection;