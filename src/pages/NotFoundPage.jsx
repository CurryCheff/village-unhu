import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="label">404</p>
        <h1 className="display">This page is no longer in the village.</h1>
        <Link className="btn btn--primary" to="/">Back to the home page</Link>
      </section>
    </main>
  );
}
