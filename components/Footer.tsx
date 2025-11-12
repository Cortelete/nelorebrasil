import React from 'react';

interface FooterProps {
  onDeveloperClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onDeveloperClick }) => {
  return (
    <footer className="w-full text-center">
      <button
        onClick={onDeveloperClick}
        className="text-sm text-neutral-400 hover:text-white transition-all duration-300"
      >
        Desenvolvido por <span className="font-bold">InteligenciArte.IA</span> ✨
      </button>
    </footer>
  );
};

export default Footer;