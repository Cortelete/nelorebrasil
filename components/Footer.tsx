import React from 'react';

interface FooterProps {
  onDeveloperClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onDeveloperClick }) => {
  return (
    <footer className="w-full text-center">
      <button
        onClick={onDeveloperClick}
        className="text-[10px] sm:text-xs text-neutral-500 hover:text-neutral-800 transition-all duration-300 uppercase tracking-widest"
      >
        Designed by <span className="font-bold text-neutral-600 hover:text-red-600 transition-colors">InteligenciArte.IA</span>
      </button>
    </footer>
  );
};

export default Footer;