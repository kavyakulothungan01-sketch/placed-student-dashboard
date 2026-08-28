import React from 'react';

/**
 * PlacedWatermark
 * ---------------
 * Renders a large, faint "PLACED" watermark centered in the main content area.
 * Uses SVG text to guarantee: dark letters, transparent background, no rectangle.
 */
const PlacedWatermark = () => (
  <div className="watermark-container">
    <svg
      className="placed-bg-watermark"
      viewBox="0 0 450 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
        fontSize="90"
        fontWeight="800"
        letterSpacing="2"
        fill="#0F172A"
      >PLACED</text>
    </svg>
  </div>
);

export default PlacedWatermark;
