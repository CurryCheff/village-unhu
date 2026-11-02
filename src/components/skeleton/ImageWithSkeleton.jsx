import React, { useEffect, useState } from 'react';
import SkeletonImage from './SkeletonImage';
import { useDelayedLoading } from '../../hooks/useDelayedLoading';

export default function ImageWithSkeleton({
  src,
  alt,
  aspectRatio = '4 / 5',
  className = '',
  imgClassName = '',
  sizes,
  priority = false,
  fallback = null,
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');
  const shouldShowSkeleton = useDelayedLoading(status === 'loading', { delay: 200, minDuration: 400 });

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  const handleLoad = () => setStatus('loaded');
  const handleError = () => setStatus('error');
  const hasImage = Boolean(src);
  const imageVisible = status === 'loaded' && hasImage;
  const showImage = hasImage && status !== 'error';

  return (
    <div className={`image-with-skeleton ${className}`.trim()} style={{ aspectRatio }} aria-busy={status === 'loading'}>
      {shouldShowSkeleton && !imageVisible && (
        <>
          <span className="sr-only" role="status">Loading image</span>
          <SkeletonImage aspectRatio={aspectRatio} className="image-with-skeleton__skeleton" />
        </>
      )}

      {showImage && (
        <img
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={`image-with-skeleton__image ${imgClassName}`.trim()}
          style={{ opacity: imageVisible ? 1 : 0, transition: 'opacity 250ms ease' }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {!hasImage && fallback}
      {status === 'error' && !fallback && (
        <div className="image-with-skeleton__fallback" aria-label="Image unavailable">
          <span aria-hidden="true">Image unavailable</span>
        </div>
      )}
    </div>
  );
}
