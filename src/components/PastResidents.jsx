import React from 'react';
import { artistList } from '../content/site';

export default function PastResidents() {
  const entries = artistList.filter((artist) => !String(artist.name).startsWith('[TODO'));
  if (!entries.length) return null;

  return (
    <section className="proof-block" aria-labelledby="residents-title">
      <p className="label">Past residents</p>
      <h3 id="residents-title">Recent artists in the village</h3>
      <ul className="resident-list">
        {entries.map((artist) => (
          <li key={artist.slug || artist.name}>
            <strong>{artist.name}</strong>
            <span>{artist.discipline}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
