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
        <p>{residencyContent.decription}</p>
      </section>

      <section className="apply-layout">
        <aside className="apply-details">
          <h2>Residency at a glance</h2>
          <ul>
            <li><strong>Length:</strong> {residencyContent.details[0].value}</li>
            <li><strong>Includes:</strong> {residencyContent.details[1].value}</li>
            <li><strong>Open to:</strong> {residencyContent.details[2].value}</li>
            <li><strong>Deadline:</strong> {residencyContent.details[3].value}</li>
            <li><strong>Stipend:</strong> {residencyContent.stipend}</li>
            <li><strong>Selection:</strong> {residencyContent.selectionProcess}</li>
          </ul>
          <Link className="btn btn--ghost" to="/">Return home</Link>
        </aside>

        <ApplyForm />
      </section>
    </main>
  );
}
