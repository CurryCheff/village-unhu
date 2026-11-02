import React from 'react';
import Skeleton from './Skeleton';

export default function SkeletonPill({ width = '5.5rem', height = '1.8rem', className = '' }) {
  return (
    <Skeleton
      width={width}
      height={height}
      radius="999px"
      className={`skeleton-pill ${className}`.trim()}
    />
  );
}
