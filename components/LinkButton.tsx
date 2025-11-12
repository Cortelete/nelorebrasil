import React from 'react';

interface LinkButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ icon, text, onClick, href, target, rel }) => {
  const commonClasses = "relative flex items-center w-full px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20 transition-all duration-300 text-white font-semibold";

  const content = (
    <>
      <span className="w-8 flex-shrink-0">{icon}</span>
      <span className="absolute left-1/2 -translate-x-1/2">{text}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={commonClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={commonClasses}>
      {content}
    </button>
  );
};

export default LinkButton;