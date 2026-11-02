import React from 'react';
import Skeleton from './Skeleton';
import SkeletonText from './SkeletonText';

export default function SkeletonCard({ className = '' }) {
  return (
    <div className={`skeleton-card ${className}`.trim()} aria-hidden="true">
      <Skeleton height="9rem" radius="1.25rem" />
      <SkeletonText lines={3} lineWidth="100%" lastLineWidth="60%" />
      <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
        <Skeleton width="4.5rem" height="2rem" radius="999px" />
        <Skeleton width="7rem" height="2rem" radius="999px" />
      </div>
    </div>
  );
}
