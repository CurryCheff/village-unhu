import React from 'react';

export default function Skeleton({
  width = '100%',
  height = '1rem',
  radius = '0.85rem',
  className = '',
  style = {},
  ...props
}) {
  return (
    <span
      aria-hidden="true"
      className={`skeleton ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      {...props}
    />
  );
}
