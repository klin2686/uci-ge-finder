import { useState, useRef, useEffect } from 'react';
import type { GECategory } from '../types/course';
import { GE_CATEGORIES, GE_CATEGORY_LABELS } from '../types/course';
import ChevronDown from '../icons/ChevronDown';
import CheckIcon from '../icons/CheckIcon';

interface GESelectorProps {
  value: GECategory | null;
  onChange: (value: GECategory | null) => void;
  placeholder?: string;
}

export default function GESelector({ value, onChange, placeholder = 'Select GE Category' }: GESelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (category: GECategory) => {
    onChange(category);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative w-[220px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white dark:bg-gray-800 border border-[#d5d7da] dark:border-gray-600 rounded-lg px-3.5 py-2.5 flex items-center justify-between gap-2 ${
          isOpen ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <span className={`text-sm font-medium truncate ${value ? 'text-black dark:text-white' : 'text-[#717680]'}`}>
          {value ? GE_CATEGORY_LABELS[value] : placeholder}
        </span>
        <ChevronDown className={`shrink-0 transition-transform text-[#717680] ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-[#d5d7da] dark:border-gray-600 rounded-lg shadow-lg max-h-[300px] overflow-y-auto z-50">
          {value && (
            <button
              onClick={handleClear}
              className="w-full px-3.5 py-2.5 text-left text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
            >
              <span>Clear selection</span>
            </button>
          )}
          {GE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleSelect(category)}
              className="w-full px-3.5 py-2.5 text-left text-sm font-medium text-black dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between"
            >
              <span>{GE_CATEGORY_LABELS[category]}</span>
              {value === category && <CheckIcon className="text-blue-500" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
