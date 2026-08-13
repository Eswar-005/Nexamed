import React, { useId } from 'react';

export const Logo = ({ size = 40 }) => {
  const uid = useId();
  const gradId = `nexamed-grad-${uid}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#0d9488" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="62" height="62" rx="18" fill={`url(#${gradId})`} />
      <path
        d="M8 34h10l5-14 10 26 7-20 4 8h12"
        stroke="#fff"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M14 42v12M8 48h12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
};