import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [signin, setSignin] = useState(() => {
    const localData = localStorage.getItem('signin');
    return localData ? JSON.parse(localData) : false;
  });

  useEffect(() => {
    localStorage.setItem('signin', JSON.stringify(signin));
  }, [signin]);

  return (
    <AuthContext.Provider value={{ signin, setSignin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
