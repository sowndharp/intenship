import React, { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: ReactNode;
  status?: string;
  indicatorColor?: 'cyan' | 'green' | 'blue' | 'slate' | 'amber';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  status,
  indicatorColor = 'cyan',
}) => {
  const accentBorder = {
    cyan: 'border-t-cyan-400/80 group-hover:border-t-cyan-300',
    green: 'border-t-emerald-400/80 group-hover:border-t-emerald-300',
    blue: 'border-t-blue-400/80 group-hover:border-t-blue-300',
    slate: 'border-t-slate-500 group-hover:border-t-slate-400',
    amber: 'border-t-amber-400/80 group-hover:border-t-amber-300',
  };

  const glowShadow = {
    cyan: 'group-hover:shadow-[0_8px_30px_rgba(6,182,212,0.12)]',
    green: 'group-hover:shadow-[0_8px_30px_rgba(16,185,129,0.12)]',
    blue: 'group-hover:shadow-[0_8px_30px_rgba(59,130,246,0.12)]',
    slate: 'group-hover:shadow-[0_8px_30px_rgba(148,163,184,0.1)]',
    amber: 'group-hover:shadow-[0_8px_30px_rgba(245,158,11,0.12)]',
  };

  return (
    <div
      className={`group bg-[#0b1120]/75 border border-slate-800/90 border-t-2 ${accentBorder[indicatorColor]} p-4 relative overflow-hidden backdrop-blur-md rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 ${glowShadow[indicatorColor]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        {icon && <div className="text-slate-400 transition-transform duration-200 group-hover:scale-110">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-2">
        <div className="font-mono text-2xl font-bold tracking-tight text-slate-100">{value}</div>
        {status && (
          <span className="font-mono text-[10px] text-emerald-400 uppercase bg-emerald-950/50 px-1.5 py-0.5 border border-emerald-800/50 rounded">
            {status}
          </span>
        )}
      </div>

      {subtext && (
        <div className="mt-2 text-xs text-slate-400 font-sans tracking-wide">
          {subtext}
        </div>
      )}
    </div>
  );
};
