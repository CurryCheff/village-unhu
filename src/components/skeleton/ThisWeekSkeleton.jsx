import React from 'react';
import SkeletonText from './SkeletonText';
import SkeletonPill from './SkeletonPill';

export default function ThisWeekSkeleton() {
  return (
    <section className="this-week" aria-busy="true" aria-live="polite" aria-label="Loading the week at the village">
      <div className="this-week__inner">
        <SkeletonPill width="7rem" />
        <div className="this-week__grid" style={{ marginTop: '1rem' }}>
          {[0, 1, 2].map((item) => (
            <div key={item}>
              <SkeletonText lines={2} lineWidth="62%" lastLineWidth="52%" height="0.9rem" gap="0.6rem" />
              <div style={{ display: 'grid', gap: '0.5rem', marginTop: '0.9rem' }}>
                <SkeletonText lines={3} lineWidth="100%" lastLineWidth="66%" height="0.8rem" gap="0.45rem" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
