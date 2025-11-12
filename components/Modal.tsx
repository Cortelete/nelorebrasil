import React from 'react';
import { XIcon } from '../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-auto p-6 relative max-h-[90vh] overflow-y-auto modal-animate" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display uppercase tracking-wider text-white">{title}</h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors">
            <XIcon />
          </button>
        </div>
        <div className="text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;