import React from 'react';

// Clean, zero-jank fade wrapper that causes zero vertical layout shift or scroll fluctuation
const FadeIn = ({ children, className = '' }) => {
  return (
    <div className={`fade-section-wrap ${className}`}>
      {children}
    </div>
  );
};

export default FadeIn;
