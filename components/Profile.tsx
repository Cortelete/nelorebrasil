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
      return;
    }
    
    setAngle(prevAngle => prevAngle + velocityRef.current);
    setVelocity(v => v * 0.97); // Friction
    
    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleSpin = () => {
    onSpinFinish();
    setVelocity(v => v + 30);
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
    <div className="flex flex-col items-center text-center w-full">
      <div className={`relative w-auto h-[25vh] min-h-[140px] max-h-[300px] aspect-square mb-1 transition-all duration-500 ease-in-out ${isZooming ? 'scale-[5] opacity-0' : 'scale-1'}`}>
        <img
          src="/logo.png"
          alt="Nelore Brasil Logo"
          className="w-full h-full object-contain cursor-pointer drop-shadow-2xl"
          onClick={handleSpin}
          style={{
            transform: `perspective(1000px) rotateY(${angle}deg)`,
            transition: 'transform 0s linear',
          }}
        />
      </div>
      <p className="font-display text-sm sm:text-base text-neutral-400 tracking-[0.3em] uppercase opacity-80 -mt-2">
        A MELHOR
      </p>
    </div>
  );
};

export default Profile;