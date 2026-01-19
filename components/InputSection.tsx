import React from 'react';

interface InputSectionProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  presetValues?: number[];
}

export const InputSection: React.FC<InputSectionProps> = ({ 
  label, 
  value, 
  onChange, 
  min, 
  max, 
  step = 1, 
  unit = '',
  presetValues = []
}) => {
  return (
    <div className="mb-6 w-full">
      {/* Header with Label and Current Value */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-black text-gray-800 uppercase tracking-wide">
          {label}
        </h3>
        <div className="bg-white/60 border border-pink-200 px-3 py-1 rounded-lg">
           <span className="text-xl font-black text-pink-600">{value}</span>
           <span className="text-xs font-bold text-gray-500 ml-1 lowercase">{unit}</span>
        </div>
      </div>
      
      {/* Slider Container */}
      <div className="relative w-full bg-pink-100/50 rounded-xl p-4 border border-pink-200">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full relative z-10 block"
        />
        
        {/* Absolute Markers */}
        <div className="relative w-full h-4 mt-2 select-none">
            {presetValues.map((val) => {
                const percent = ((val - min) / (max - min)) * 100;
                const isSelected = Math.abs(value - val) <= (step * 2); // Highlight if close
                return (
                    <div 
                        key={val} 
                        className="absolute top-0 transform -translate-x-1/2 flex flex-col items-center transition-colors duration-200"
                        style={{ left: `${percent}%` }}
                    >
                        {/* Tick */}
                        <div className={`w-0.5 h-1.5 mb-1 ${isSelected ? 'bg-pink-600' : 'bg-pink-300'}`}></div>
                        {/* Label */}
                        <span className={`text-[10px] font-bold leading-none ${isSelected ? 'text-pink-700 scale-110' : 'text-gray-400'}`}>
                            {val}
                        </span>
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
};