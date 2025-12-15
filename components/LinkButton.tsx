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
  const commonClasses = "group relative flex items-center justify-between w-full px-4 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/5 hover:border-white/20 transition-all duration-300 text-white backdrop-blur-md overflow-hidden";
  
  const content = (
    <>
      <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
      
      <div className="flex items-center space-x-4 z-10">
        <span className="text-neutral-300 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </span>
        <span className="font-medium text-sm sm:text-base tracking-wide">{text}</span>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
            <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
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