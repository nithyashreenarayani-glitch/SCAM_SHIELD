import React from 'react';
import { RiskLevel } from '../../types';
import { ShieldAlert, ShieldCheck, AlertTriangle, ShieldX } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  confidence = 90,
  size = 'md',
}) => {
  // Clamp score
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  // Gauge geometry
  const radius = size === 'lg' ? 90 : size === 'md' ? 70 : 50;
  const strokeWidth = size === 'lg' ? 14 : size === 'md' ? 11 : 8;
  const circumference = 2 * Math.PI * radius;
  // Semi-circle gauge (180 degrees)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * safeScore) / 100;

  // Level theme
  const getLevelDetails = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return {
          textColor: 'text-red-400',
          borderColor: 'border-red-500/30',
          bgColor: 'bg-red-950/40',
          strokeColor: '#EF4444',
          label: 'CRITICAL RISK',
          icon: <ShieldX className="w-5 h-5 text-red-400" />,
        };
      case 'HIGH':
        return {
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          bgColor: 'bg-orange-950/40',
          strokeColor: '#F97316',
          label: 'HIGH RISK',
          icon: <AlertTriangle className="w-5 h-5 text-orange-400" />,
        };
      case 'MEDIUM':
        return {
          textColor: 'text-amber-400',
          borderColor: 'border-amber-500/30',
          bgColor: 'bg-amber-950/40',
          strokeColor: '#F59E0B',
          label: 'MEDIUM RISK',
          icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
        };
      default:
        return {
          textColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/30',
          bgColor: 'bg-emerald-950/40',
          strokeColor: '#10B981',
          label: 'LOW RISK',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
        };
    }
  };

  const levelInfo = getLevelDetails();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        <svg
          className="transform -rotate-135"
          width={radius * 2 + strokeWidth * 2}
          height={radius * 2 + strokeWidth * 2}
        >
          {/* Background Track */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke="rgba(30, 41, 59, 0.8)"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeLinecap="round"
          />
          {/* Active Risk Gauge Arc */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="transparent"
            stroke={levelInfo.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl md:text-4xl font-extrabold font-mono tabular-nums tracking-tight text-white">
            {safeScore}
          </span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>

      {/* Semantic Risk Badge */}
      <div
        className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-md border ${levelInfo.borderColor} ${levelInfo.bgColor}`}
      >
        {levelInfo.icon}
        <span className={`text-xs md:text-sm font-bold tracking-wider ${levelInfo.textColor}`}>
          {levelInfo.label}
        </span>
      </div>

      {/* Confidence Level */}
      <div className="mt-2 flex items-center gap-2 text-xs text-slate-400 font-mono tabular-nums">
        <span>Confidence:</span>
        <span className="text-slate-200 font-semibold">{confidence}%</span>
      </div>
    </div>
  );
};
