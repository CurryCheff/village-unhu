import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';
import SkeletonButton from './SkeletonButton';
import SkeletonPill from './SkeletonPill';

export default function PageSkeleton({ variant = 'apply' }) {
  const isArtist = variant === 'artist';

  return (
    <main className="page-shell" aria-busy="true" aria-live="polite">
      <span className="sr-only" role="status">Loading page</span>
      <section className="page-header" aria-hidden="true">
        <SkeletonPill width="9.5rem" />
        <Skeleton height="3.4rem" width="min(100%, 42rem)" radius="1rem" />
        <SkeletonText lines={2} lineWidth="100%" lastLineWidth="72%" />
      </section>

      {isArtist ? (
        <section className="artist-page" aria-hidden="true">
          <div className="artist-page__hero">
            <Skeleton width="5rem" height="5rem" radius="50%" />
            <div style={{ display: 'grid', gap: '0.7rem', width: '100%' }}>
              <SkeletonText lines={2} lineWidth="66%" lastLineWidth="42%" height="0.8rem" gap="0.5rem" />
            </div>
          </div>
          <Skeleton height="4.5rem" radius="1rem" width="100%" />
          <SkeletonText lines={4} lineWidth="100%" lastLineWidth="82%" />
          <div className="artist-works" style={{ display: 'grid', gap: '1rem' }}>
            {[0, 1].map((item) => (
              <div key={item} className="artist-work" style={{ display: 'grid', gap: '0.8rem' }}>
                <Skeleton height="1rem" width="35%" radius="999px" />
                <SkeletonText lines={3} lineWidth="100%" lastLineWidth="64%" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="apply-layout" aria-hidden="true">
          <aside className="apply-details" style={{ display: 'grid', gap: '1rem' }}>
            <Skeleton height="2rem" width="52%" radius="0.8rem" />
            {[0, 1, 2, 3].map((item) => (
              <SkeletonText key={item} lines={2} lineWidth="100%" lastLineWidth="72%" height="0.8rem" gap="0.45rem" />
            ))}
            <SkeletonButton width="8.2rem" />
          </aside>

          <div className="apply-form" style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
              <SkeletonText lines={2} lineWidth="100%" lastLineWidth="62%" height="0.8rem" gap="0.45rem" />
              <SkeletonText lines={2} lineWidth="100%" lastLineWidth="62%" height="0.8rem" gap="0.45rem" />
            </div>
            <SkeletonText lines={2} lineWidth="100%" lastLineWidth="72%" height="0.8rem" gap="0.45rem" />
            <Skeleton height="7rem" radius="1rem" width="100%" />
            <Skeleton height="4rem" radius="1rem" width="100%" />
            <SkeletonButton width="10rem" />
          </div>
        </section>
      )}
    </main>
  );
}
