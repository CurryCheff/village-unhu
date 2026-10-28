import React, { useMemo, useState } from 'react';

const zones = [
  { id: 'studios', label: 'Open studios', title: 'Open studios', description: 'Shared light-filled workspaces, tools and storage for resident makers.', x: 22, y: 36, width: 22, height: 20 },
  { id: 'clay', label: 'Print & clay', title: 'Print & clay', description: 'Press room, kilns and a place for dusty experiments and slow process.', x: 51, y: 32, width: 18, height: 22 },
  { id: 'table', label: 'The long table', title: 'The long table', description: 'A communal kitchen and critique space for lunch, stories and exchange.', x: 46, y: 62, width: 26, height: 18 },
  { id: 'gallery', label: 'Gallery', title: 'Gallery', description: 'Current exhibitions and an open wall for the season’s new work.', x: 24, y: 63, width: 18, height: 18 },
];

export default function VillageMap() {
  const [activeId, setActiveId] = useState('studios');
  const activeZone = useMemo(() => zones.find((zone) => zone.id === activeId) ?? zones[0], [activeId]);

  const handleKeyDown = (event, zone) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveId(zone.id);
    }
  };

  return (
    <div className="village-map-wrap">
      <div className="village-map" aria-label="Village map showing studios, gallery, print room and long table">
        <svg viewBox="0 0 100 100" role="img" aria-labelledby="village-map-title village-map-desc" className="village-map__svg">
          <title id="village-map-title">Village map</title>
          <desc id="village-map-desc">Illustrated map of the village with four highlighted zones.</desc>
          <rect x="4" y="4" width="92" height="92" rx="6" className="map-base" />
          <rect x="11" y="11" width="78" height="78" rx="6" className="map-outline" />
          <path d="M24 31h26v16H24z" className="map-path" />
          <path d="M52 31h25v16H52z" className="map-path" />
          <path d="M44 58h28v18H44z" className="map-path" />
          <path d="M20 60h18v18H20z" className="map-path" />
          {zones.map((zone) => (
            <g key={zone.id}>
              <rect
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx="3"
                className={activeId === zone.id ? 'map-zone map-zone--active' : 'map-zone'}
                role="button"
                tabIndex={0}
                aria-label={zone.label}
                onClick={() => setActiveId(zone.id)}
                onKeyDown={(event) => handleKeyDown(event, zone)}
              />
            </g>
          ))}
        </svg>
      </div>
      <aside className="village-map__panel" aria-live="polite">
        <p className="label">Village plan</p>
        <h3>{activeZone.title}</h3>
        <p>{activeZone.description}</p>
      </aside>
    </div>
  );
}
