import React from 'react';
import { Crosshair, Swords, Skull, Zap } from 'lucide-react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dark Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_90%)]" />

      {/* Blood Stains (simulated with radial gradients) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(69,10,10,0.4)_0%,transparent_60%)] blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(127,29,29,0.2)_0%,transparent_60%)] blur-3xl opacity-50" />
      
      {/* Splatter Effect (small random dots) */}
      <div className="absolute top-[20%] right-[15%] w-32 h-32 bg-red-900 rounded-full blur-[40px] opacity-20" />
      
      {/* Floating Icons (Simulating weapons/gritty elements) */}
      <div className="absolute top-[10%] left-[5%] opacity-[0.03] rotate-45 transform">
        <Swords size={300} strokeWidth={1} />
      </div>

      <div className="absolute bottom-[20%] right-[5%] opacity-[0.03] -rotate-12 transform">
        <Crosshair size={400} strokeWidth={1} />
      </div>

      <div className="absolute top-[40%] right-[40%] opacity-[0.02] rotate-180 transform">
        <Skull size={200} strokeWidth={1} />
      </div>

      <div className="absolute bottom-[10%] left-[30%] opacity-[0.02] transform">
        <Zap size={150} strokeWidth={1} />
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>
    </div>
  );
};