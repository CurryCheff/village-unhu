import { useEffect, useState } from 'react';

export default function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      const [entry] = entries;
      setInView(Boolean(entry && entry.isIntersecting));
    }, {
      threshold: options.threshold ?? 0.2,
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px',
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.root, options.rootMargin, options.threshold, ref]);

  return inView;
}
