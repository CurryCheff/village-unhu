import React from 'react';
import SkeletonImage from './SkeletonImage';
import SkeletonText from './SkeletonText';

export default function GalleryItemSkeleton() {
  return (
    <li className="gallery__item" aria-hidden="true">
      <div className="artwork artwork--skeleton">
        <SkeletonImage aspectRatio="4 / 5" className="gallery-item-skeleton__image" />
      </div>
      <div className="gallery-item-skeleton__meta">
        <SkeletonText lines={2} lineWidth="100%" lastLineWidth="66%" height="0.8rem" gap="0.45rem" />
      </div>
    </li>
  );
}
