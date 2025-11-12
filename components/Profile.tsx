import React, { useState, useEffect, useRef } from 'react';

interface ProfileProps {
  onSpinFinish: () => void;
  isZooming: boolean;
}

const Profile: React.FC<ProfileProps> = ({ onSpinFinish, isZooming }) => {
  const [angle, setAngle] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const animationFrameId = useRef<number | null>(null);
  const velocityRef = useRef(velocity);

  useEffect(() => {
    velocityRef.current = velocity;
  }, [velocity]);

  const animate = () => {
    if (Math.abs(velocityRef.current) < 0.01) {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
      setAngle(prevAngle => Math.round(prevAngle / 360) * 360);
      setVelocity(0);
      
      // Elegantly open the modal after a short delay
      setTimeout(() => {
        onSpinFinish();
      }, 300);

      return;
    }
    
    setAngle(prevAngle => prevAngle + velocityRef.current);
    setVelocity(v => v * 0.97); // Friction
    
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleSpin = () => {
    setVelocity(v => v + 30); // Kick
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };
  
  useEffect(() => {
    return () => {
        if(animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
        }
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-full px-4">
      <div className={`w-32 h-32 md:w-40 md:h-40 p-1 rounded-full bg-gradient-to-br from-red-700 to-black shadow-lg mb-4 transition-all duration-500 ease-in-out ${isZooming ? 'scale-[5] opacity-0' : 'scale-1'}`}>
        <img
          src="/logo.png"
          alt="Nelore Brasil Logo"
          className="w-full h-full rounded-full object-cover cursor-pointer"
          onClick={handleSpin}
          style={{
            transform: `perspective(1000px) rotateY(${angle}deg)`,
            transition: 'transform 0s linear',
          }}
        />
      </div>
      <h1 className="font-display text-4xl md:text-5xl font-bold tracking-wider uppercase">
        <span className="text-white">NELORE</span> <span style={{ color: '#850305' }}>BRASIL</span>
      </h1>
      <p className="mt-2 text-sm md:text-base text-neutral-300 max-w-sm">
        Qualidade assim, você nunca viu!
      </p>
    </div>
  );
};

export default Profile;