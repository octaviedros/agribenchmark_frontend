"use client"
// This context file is used to store the user's login information.
// We will switch to a proper implementation (NextAuth.) after the agribenchmark academy.
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoginContextProps {
  email: string;
  setEmail: (email: string) => void;
}

const LoginContext = createContext<LoginContextProps | undefined>(undefined);

export const LoginProvider = ({ children }: { children: ReactNode }) => {
  const prevEmail = (typeof window !== 'undefined') ? localStorage.getItem('email') : '';
  const [email, setEmail] = useState<string>(prevEmail || '');

  // Store email in local storage when it changes
  React.useEffect(() => {
    if (email !== localStorage.getItem('email')) {
      localStorage.setItem('email', email);
    }
  }, [email]);

  // Retrieve email from local storage on initial load
  React.useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <LoginContext.Provider value={{ email, setEmail }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = (): LoginContextProps => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error('useLogin must be used within a LoginProvider');
  }
  return context;
};
