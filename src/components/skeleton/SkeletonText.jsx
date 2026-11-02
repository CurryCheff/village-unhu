import React from 'react';
import Skeleton from './Skeleton';

export default function SkeletonText({
  lines = 3,
  className = '',
  lineWidth = '100%',
  lastLineWidth = '68%',
  gap = '0.7rem',
  height = '0.9rem',
  radius = '999px',
}) {
  const lineCount = Math.max(1, Number(lines) || 1);

  return (
    <div className={`skeleton-text ${className}`.trim()} style={{ display: 'grid', gap }} aria-hidden="true">
      {Array.from({ length: lineCount }).map((_, index) => (
        <Skeleton
          key={`line-${index}`}
          width={index === lineCount - 1 ? lastLineWidth : lineWidth}
          height={height}
          radius={radius}
        />
      ))}
    </div>
  );
}
