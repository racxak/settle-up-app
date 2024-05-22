import React, { createContext, useReducer } from 'react';
import { authReducer, initialState, LOGIN, LOGOUT } from '../reducers/authReducer';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (token, userId) => {
    dispatch({ type: LOGIN, payload: { token, userId } });
  };

  const logout = () => {
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
