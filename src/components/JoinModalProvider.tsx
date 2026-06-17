'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type JoinModalContextValue = {
  open: boolean;
  trigger: () => void;
  close: () => void;
};

const JoinModalContext = createContext<JoinModalContextValue>({
  open: false,
  trigger: () => {},
  close: () => {},
});

export function useJoinModal() {
  return useContext(JoinModalContext);
}

export function JoinModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const trigger = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <JoinModalContext.Provider value={{ open, trigger, close }}>
      {children}
    </JoinModalContext.Provider>
  );
}
