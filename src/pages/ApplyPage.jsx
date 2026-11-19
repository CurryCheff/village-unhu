import React from 'react';
import { Link } from 'react-router-dom';
import ApplyForm from '../components/ApplyForm';
import { residencyContent } from '../content/site';

export default function ApplyPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="label">Residency applications</p>
        <h1 className="display">Apply to Village Unhu</h1>
        <p>{residencyContent.description}</p>
      </section>

      <section className="apply-layout">
        <aside className="apply-details">
          <h2>Residency at a glance</h2>
          <ul>
            {residencyContent.details.map((detail) => (
              <li key={detail.label}><strong>{detail.label}:</strong> {detail.value}</li>
            ))}
          </ul>
          <Link className="btn btn--ghost" to="/">Return home</Link>
        </aside>

        <ApplyForm />
      </section>
    </main>
  );
}
