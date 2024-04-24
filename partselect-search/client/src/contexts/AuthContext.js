import { createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useLocalStorage("userEmail", null);
  return (
    <AuthContext.Provider
      value={{userEmail, setUserEmail}}>
      {children}
    </AuthContext.Provider>
  );
}
