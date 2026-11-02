import React from 'react';
import Skeleton from './Skeleton';

export default function SkeletonCircle({ size = '3rem', className = '' }) {
  return (<Skeleton width={size} height={size} radius="50%" className={className} />);
}
