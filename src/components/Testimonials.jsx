import React from 'react';
import { testimonialList } from '../content/site';

export default function Testimonials() {
  const entries = testimonialList.filter((quote) => !String(quote.quote).startsWith('[TODO'));
  if (!entries.length) return null;

  return (
    <section className="proof-block" aria-labelledby="testimonials-title">
      <p className="label">What people say</p>
      <h3 id="testimonials-title">Community notes</h3>
      <div className="proof-grid">
        {entries.map((entry) => (
          <blockquote key={entry.name} className="proof-card">
            <p>“{entry.quote}”</p>
            <footer>{entry.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
