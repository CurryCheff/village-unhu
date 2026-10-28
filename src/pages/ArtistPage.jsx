import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { artistList } from '../content/site';

export default function ArtistPage() {
  const { slug } = useParams();
  const artist = artistList.find((entry) => entry.slug === slug);

  if (!artist) {
    return (
      <main className="page-shell">
        <section className="page-header">
          <p className="label">Artist not found</p>
          <h1 className="display">This artist is not in the archive yet.</h1>
          <Link className="btn btn--primary" to="/">Return to the village</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="artist-page">
        <div className="artist-page__hero">
          <div className="artist-avatar" aria-hidden="true">{artist.name.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="label">Artist profile</p>
            <h1 className="display">{artist.name}</h1>
            <p>{artist.discipline}</p>
          </div>
        </div>
        <blockquote className="artist-quote">“{artist.quote}”</blockquote>
        <p>{artist.bio}</p>
        <div className="artist-works">
          {artist.works.length ? artist.works.map((work) => <div key={work.title} className="artist-work"><h3>{work.title}</h3><p>{work.description}</p></div>) : <div className="artist-work"><h3>Works coming soon</h3><p>[TODO: add artist work notes]</p></div>}
        </div>
        <Link className="btn btn--ghost" to="/">Back to gallery</Link>
      </section>
    </main>
  );
}
