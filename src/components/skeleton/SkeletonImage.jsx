import React from 'react';
import Skeleton from './Skeleton';

export default function SkeletonImage({
  aspectRatio = '4 / 5',
  width = '100%',
  height = '100%',
  radius = '1.25rem',
  className = '',
}) {
  return (
    <Skeleton
      width={width}
      height={height}
      radius={radius}
      className={`skeleton-image ${className}`.trim()}
      style={{ aspectRatio }}
    />
  );
}
