import React from 'react';
import Skeleton from './Skeleton';

export default function SkeletonButton({ width = '8rem', height = '2.8rem', className = '' }) {
  return (
    <Skeleton
      width={width}
      height={height}
      radius="999px"
      className={`skeleton-button ${className}`.trim()}
    />
  );
}
