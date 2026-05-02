import React, { createContext, useState } from 'react';
import { register as registerApi, login as loginApi, logout as logoutApi } from '../api/auth.api';
import { hashForServer, deriveMasterKey } from '../crypto/cryptoUtils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [masterKey, setMasterKey] = useState(null);

  const isAuthenticated = !!accessToken;

  const register = async (email, masterPassword) => {
    const masterPasswordHash = hashForServer(masterPassword);
    const data = await registerApi({ email, masterPasswordHash });
    
    setAccessToken(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    
    setMasterKey(deriveMasterKey(masterPassword));
  };

  const login = async (email, masterPassword) => {
    const masterPasswordHash = hashForServer(masterPassword);
    const data = await loginApi({ email, masterPasswordHash });

    setAccessToken(data.accessToken);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    setMasterKey(deriveMasterKey(masterPassword));
  };


  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
         await logoutApi({ refreshToken });
      }
    } catch(err) {
       console.error("Logout error", err);
    } finally {
       setAccessToken(null);
       setMasterKey(null);
       localStorage.removeItem('accessToken');
       localStorage.removeItem('refreshToken');
    }
  };

  const unlockVault = (masterPassword) => {
      setMasterKey(deriveMasterKey(masterPassword));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, masterKey, user, register, login, logout, unlockVault, setMasterKey }}>
      {children}
    </AuthContext.Provider>
  );
};
