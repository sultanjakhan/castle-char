
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  name: string; // Used for generating avatar
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, name }) => {
  const [error, setError] = useState(false);

  // Reset error state if src changes
  useEffect(() => {
    setError(false);
  }, [src]);

  // Fallback URL generator (UI Avatars)
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=171717&color=a3a3a3&size=512&font-size=0.33&bold=true`;

  if (!src || error) {
    return (
      <img 
        src={fallbackUrl} 
        alt={alt} 
        className={className}
      />
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
