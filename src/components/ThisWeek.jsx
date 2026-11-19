import React from 'react';
import { site } from '../content/site';

export default function ThisWeek() {
  const entries = site.thisWeek.labels
    .map((label) => site.thisWeek.items.find((item) => item.label === label))
    .filter((item) => item && typeof item.value === 'string' && item.value.trim());
  if (!site.features.thisWeek || !entries.length) return null;

  return (
    <section className="this-week" aria-label="Village Unhu updates">
      <div className="this-week__inner">
        <div className="this-week__grid">
          {entries.map((item) => (
            <div key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
