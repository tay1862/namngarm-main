'use client';

import { ChevronDown } from 'lucide-react';

interface FAQButtonProps {
  onClick: () => void;
  isOpen: boolean;
  children: React.ReactNode;
}

export default function FAQButton({ onClick, isOpen, children }: FAQButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-pink-25 transition-colors duration-200"
    >
      {children}
      <ChevronDown
        className={`w-5 h-5 text-neutral-400 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`}
      />
    </button>
  );
}
