import { cn } from '@/lib/utils';

export function BarChart({
  data,
  height = 180,
  color = '#16845B',
  showValues = false,
  formatValue,
}: {
  data: { month: string; value: number }[];
  height?: number;
  color?: string;
  showValues?: boolean;
  formatValue?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2 sm:gap-3" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height - 36);
        const isLast = i === data.length - 1;
        return (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 min-w-0 group">
            <div className="text-[10px] font-semibold text-ink-700 num opacity-0 group-hover:opacity-100 transition-opacity">
              {formatValue ? formatValue(d.value) : d.value}
            </div>
            <div
              className="w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 relative"
              style={{
                height: Math.max(h, 4),
                backgroundColor: color,
                opacity: isLast ? 1 : 0.55,
              }}
            >
              {isLast && <div className="absolute -top-1 left-0 right-0 h-1 rounded-full bg-gold" />}
            </div>
            <span className="text-[10px] text-ink-500 truncate w-full text-center">{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

export function DonutChart({
  segments,
  size = 140,
  thickness = 16,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string | number;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((seg, i) => {
            const length = (seg.value / total) * circumference;
            const circle = (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={thickness}
                strokeDasharray={`${length} ${circumference - length}`}
                strokeDashoffset={-offset}
                strokeLinecap="round"
              />
            );
            offset += length;
            return circle;
          })}
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E5EBE6" strokeWidth={thickness} strokeDasharray={`${circumference} 0`} opacity={0} />
        </svg>
        {(centerLabel || centerValue) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {centerValue && <span className="text-xl font-bold text-ink-900 num">{centerValue}</span>}
            {centerLabel && <span className="text-[10px] text-ink-500 mt-0.5">{centerLabel}</span>}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
            <span className="text-xs text-ink-700 flex-1 truncate">{seg.label}</span>
            <span className="text-xs font-semibold text-ink-900 num">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  color = '#16845B',
  className,
  showLabel = false,
}: {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  showLabel?: boolean;
}) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('relative', className)}>
      <div className="h-2 bg-line rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {showLabel && (
        <span className="absolute -top-5 left-0 text-[10px] font-medium text-ink-500 num">{Math.round(pct)}%</span>
      )}
    </div>
  );
}

export function Sparkline({
  data,
  width = 80,
  height = 28,
  color = '#16845B',
}: {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polygon points={areaPoints} fill={color} opacity={0.1} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
