import React from 'react';

const PieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.cantidad, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="relative w-40 h-40 mx-auto">
        {data.map((item, i) => {
          const percent = (item.cantidad / total) * 100;
          const start = cumulativePercent;
          cumulativePercent += percent;
          
          return (
            <svg key={i} className="absolute top-0 left-0 w-full h-full">
              <circle
                cx="50%"
                cy="50%"
                r="50%"
                fill="transparent"
                stroke={`hsl(${(i * 90) % 360}, 70%, 50%)`}
                strokeWidth="40"
                strokeDasharray={`${percent} ${100 - percent}`}
                strokeDashoffset={`${25 - start}`}
                transform="rotate(-90) translate(-100)"
              />
            </svg>
          );
        })}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: `hsl(${(i * 90) % 360}, 70%, 50%)` }}
            />
            <span className="text-sm">{item.nombre} ({Math.round((item.cantidad / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChart;