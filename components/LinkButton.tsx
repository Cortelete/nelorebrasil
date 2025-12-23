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
  // Alterado para justify-center para centralizar o texto
  // Reduzido padding vertical para py-2.5 para melhor ajuste em mobile sem rolagem
  const commonClasses = "group relative flex items-center justify-center w-full px-4 py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-white/5 to-white/10 hover:from-white/10 hover:to-white/20 border border-white/5 hover:border-white/20 transition-all duration-300 text-white backdrop-blur-md overflow-hidden";
  
  const content = (
    <>
      <div className="absolute inset-0 bg-white/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none"></div>
      
      {/* Ícone posicionado absolutamente à esquerda */}
      <div className="absolute left-4 z-10 flex items-center">
        <span className="text-neutral-300 group-hover:text-white transition-colors duration-300 transform group-hover:scale-110">
            {React.cloneElement(icon as React.ReactElement, { className: "w-5 h-5" })}
        </span>
      </div>

      {/* Texto centralizado pelo container pai */}
      <span className="font-medium text-sm sm:text-base tracking-wide z-10 text-center">{text}</span>
      
      {/* Seta posicionada absolutamente à direita */}
      <div className="absolute right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-x-2 group-hover:translate-x-0 flex items-center">
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