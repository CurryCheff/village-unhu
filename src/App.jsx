import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ApplyPage from './pages/ApplyPage';
import ArtistPage from './pages/ArtistPage';
import NotFoundPage from './pages/NotFoundPage';
import { site } from './content/site';

function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const element = document.getElementById(location.hash.replace('#', ''));
    if (element) {
      window.requestAnimationFrame(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash, location.pathname]);

  return null;
}

export default function App() {
  const contactPhone = typeof site.contact?.phone === 'string' && !site.contact.phone.trim().startsWith('[TODO')
    ? site.contact.phone.trim()
    : '';

  return (
    <>
      {contactPhone && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Village Unhu',
            telephone: contactPhone,
          }}
        />
      )}
      <ScrollToHash />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/apply" element={<ApplyPage />} />
        <Route path="/artists/:slug" element={<ArtistPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
