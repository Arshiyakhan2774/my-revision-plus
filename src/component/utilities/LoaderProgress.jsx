import React, { useEffect } from 'react';

const ProgressLoader = ({ duration = 3000 ,progress ,setProgress}) => {
 

    useEffect(() => {
        if (progress >= 100) return;
        
        const increment = duration / 100;
        const interval = setInterval(() => {
          setProgress(prev => Math.min(prev + 1, 100));
        }, increment);
      
        return () => clearInterval(interval);
      }, [duration, progress, setProgress]);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
      <div className="w-64">
        <div className="h-2 bg-gray-200 rounded-full mb-4">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-center text-gray-700">Loading {progress}%</p>
      </div>
    </div>
  );
};

export default ProgressLoader;