import { createContext, useRef, useState } from 'react';

export type LayoutContextType = {
  mainRef: React.RefObject<HTMLDivElement>;
  isSidebarAvailable: boolean;
  setIsSidebarAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LayoutContext = createContext({} as LayoutContextType);

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarAvailable, setIsSidebarAvailable] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isSidebarAvailable,
        setIsSidebarAvailable,
        mainRef,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}
