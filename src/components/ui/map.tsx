import { useState } from 'react';
import { Bus as BusIcon, Home, School, MapPin, ZoomIn, ZoomOut, Layers, Navigation } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'bus' | 'school' | 'home' | 'stop';
  label?: string;
  status?: string;
  color?: string;
  isMoving?: boolean;
}

export interface RoutePoint {
  lat: number;
  lng: number;
}

export function MapView({
  markers = [],
  route = [],
  height = '100%',
  className,
  dark = false,
  showControls = true,
  showLegend = true,
  focusedMarkerId,
  onMarkerClick,
  title,
}: {
  markers?: MapMarker[];
  route?: RoutePoint[];
  height?: string | number;
  className?: string;
  dark?: boolean;
  showControls?: boolean;
  showLegend?: boolean;
  focusedMarkerId?: string;
  onMarkerClick?: (id: string) => void;
  title?: string;
}) {
  const [zoom, setZoom] = useState(1);
  const [showHomes, setShowHomes] = useState(true);
  const [showRoute, setShowRoute] = useState(true);

  const allPoints = [...markers.map((m) => ({ lat: m.lat, lng: m.lng })), ...route];
  if (allPoints.length === 0) allPoints.push({ lat: 24.7136, lng: 46.6753 });

  const lats = allPoints.map((p) => p.lat);
  const lngs = allPoints.map((p) => p.lng);
  const minLat = Math.min(...lats) - 0.01;
  const maxLat = Math.max(...lats) + 0.01;
  const minLng = Math.min(...lngs) - 0.01;
  const maxLng = Math.max(...lngs) + 0.01;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng || 1)) * 100;
    const y = ((maxLat - lat) / (maxLat - minLat || 1)) * 100;
    return { x, y };
  };

  const routePath = showRoute && route.length > 1
    ? route.map((p, i) => {
        const { x, y } = project(p.lat, p.lng);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ')
    : '';

  const visibleMarkers = markers.filter((m) => m.type !== 'home' || showHomes);

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden',
        dark ? 'map-grid-dark' : 'map-grid',
        className
      )}
      style={{ height }}
    >
      {/* Map decorative roads */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <line x1="0" y1="35%" x2="100%" y2="30%" stroke={dark ? '#3A4A42' : '#C8D4CC'} strokeWidth="3" />
        <line x1="0" y1="70%" x2="100%" y2="75%" stroke={dark ? '#3A4A42' : '#C8D4CC'} strokeWidth="2" />
        <line x1="30%" y1="0" x2="35%" y2="100%" stroke={dark ? '#3A4A42' : '#C8D4CC'} strokeWidth="2" />
        <line x1="70%" y1="0" x2="65%" y2="100%" stroke={dark ? '#3A4A42' : '#C8D4CC'} strokeWidth="3" />
      </svg>

      {/* Route line */}
      {routePath && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d={routePath} fill="none" stroke="#16845B" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.6" />
          <path d={routePath} fill="none" stroke="#16845B" strokeWidth="0.4" opacity="0.9" />
        </svg>
      )}

      {/* Markers */}
      <div className="absolute inset-0" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
        {visibleMarkers.map((m) => {
          const { x, y } = project(m.lat, m.lng);
          const isFocused = focusedMarkerId === m.id;
          return (
            <button
              key={m.id}
              onClick={() => onMarkerClick?.(m.id)}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
                isFocused ? 'z-20 scale-125' : 'z-10 hover:scale-110'
              )}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <MarkerContent marker={m} isFocused={isFocused} dark={dark} />
            </button>
          );
        })}
      </div>

      {/* Title overlay */}
      {title && (
        <div className="absolute top-3 right-3 z-30">
          <div className={cn('px-3 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm', dark ? 'bg-emerald-deep/80 text-white' : 'bg-white/90 text-ink-900')}>
            {title}
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.25, 2))}
            className="h-8 w-8 bg-white rounded-lg shadow-card flex items-center justify-center text-ink-700 hover:bg-surface-subtle transition-colors"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.25, 0.75))}
            className="h-8 w-8 bg-white rounded-lg shadow-card flex items-center justify-center text-ink-700 hover:bg-surface-subtle transition-colors"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => setShowHomes((v) => !v)}
            className={cn(
              'h-8 w-8 rounded-lg shadow-card flex items-center justify-center transition-colors',
              showHomes ? 'bg-emerald text-white' : 'bg-white text-ink-700 hover:bg-surface-subtle'
            )}
          >
            <Home size={16} />
          </button>
          <button
            onClick={() => setShowRoute((v) => !v)}
            className={cn(
              'h-8 w-8 rounded-lg shadow-card flex items-center justify-center transition-colors',
              showRoute ? 'bg-emerald text-white' : 'bg-white text-ink-700 hover:bg-surface-subtle'
            )}
          >
            <Navigation size={16} />
          </button>
        </div>
      )}

      {/* Legend */}
      {showLegend && (
        <div className={cn('absolute bottom-3 right-3 z-30 px-3 py-2 rounded-lg shadow-card', dark ? 'bg-emerald-deep/80 text-white backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm')}>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald" />حافلة</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gold" />مدرسة</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-info" />منزل</span>
          </div>
        </div>
      )}
    </div>
  );
}

function MarkerContent({ marker, isFocused, dark }: { marker: MapMarker; isFocused: boolean; dark: boolean }) {
  const colors: Record<string, string> = {
    bus: marker.color || '#16845B',
    school: '#C9A45C',
    home: '#4285B8',
    stop: '#718078',
  };
  const color = colors[marker.type];

  if (marker.type === 'bus') {
    return (
      <div className="relative">
        {marker.isMoving && (
          <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ backgroundColor: color, opacity: 0.3 }} />
        )}
        <div
          className={cn('relative flex items-center justify-center rounded-full shadow-lg', isFocused ? 'h-10 w-10' : 'h-8 w-8')}
          style={{ backgroundColor: color }}
        >
          <BusIcon size={isFocused ? 20 : 16} className="text-white" />
        </div>
        {isFocused && marker.label && (
          <div className={cn('absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded-lg text-[10px] font-medium shadow-card', dark ? 'bg-emerald-deep text-white' : 'bg-white text-ink-900')}>
            {marker.label}
          </div>
        )}
      </div>
    );
  }

  if (marker.type === 'school') {
    return (
      <div className="relative flex items-center justify-center h-8 w-8 rounded-lg shadow-lg" style={{ backgroundColor: color }}>
        <School size={16} className="text-white" />
      </div>
    );
  }

  if (marker.type === 'home') {
    return (
      <div className="relative flex items-center justify-center h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: color }}>
        <Home size={11} className="text-white" />
      </div>
    );
  }

  return (
    <div className="h-4 w-4 rounded-full shadow-sm" style={{ backgroundColor: color }}>
      <MapPin size={12} className="text-white" />
    </div>
  );
}
