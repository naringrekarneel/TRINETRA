import React, { createContext, useContext, useState, useEffect } from 'react';

interface ElementNumberContextType {
  showNumbers: boolean;
  toggleNumbers: () => void;
  setShowNumbers: (val: boolean) => void;
}

const ElementNumberContext = createContext<ElementNumberContextType>({
  showNumbers: true,
  toggleNumbers: () => {},
  setShowNumbers: () => {},
});

export const ElementNumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showNumbers, setShowNumbers] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('qrguard-show-numbers');
      if (stored !== null) return stored === 'true';
    }
    // Default to true as requested by the user
    return true;
  });

  useEffect(() => {
    try {
      localStorage.setItem('qrguard-show-numbers', String(showNumbers));
    } catch {
      // ignore
    }
  }, [showNumbers]);

  const toggleNumbers = () => setShowNumbers((prev) => !prev);

  return (
    <ElementNumberContext.Provider value={{ showNumbers, toggleNumbers, setShowNumbers }}>
      {children}
    </ElementNumberContext.Provider>
  );
};

export const useElementNumbers = () => useContext(ElementNumberContext);

interface NumBadgeProps {
  id: number;
  inline?: boolean;
  className?: string;
}

export const NumBadge: React.FC<NumBadgeProps> = ({ id, inline = false, className = '' }) => {
  const { showNumbers } = useElementNumbers();
  if (!showNumbers) return null;

  if (inline) {
    return (
      <span
        aria-hidden="true"
        title={`Element #${id}`}
        className={`inline-flex items-center justify-center px-1.5 py-0.2 mx-1 text-[10px] font-mono font-bold tracking-tight bg-amber-100 text-amber-900 border border-amber-300 rounded shadow-xs dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-700/80 select-none pointer-events-none ${className}`}
      >
        #{id}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      title={`Element #${id}`}
      className={`absolute -top-2.5 -left-2.5 z-20 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded shadow-xs dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700 select-none pointer-events-none ${className}`}
    >
      #{id}
    </span>
  );
};
