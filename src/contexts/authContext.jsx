import React, { createContext, useEffect, useReducer } from 'react';
import { authReducer, initialState, LOGIN, LOGOUT } from '../reducers/authReducer';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (token && userId) {
      dispatch({ type: LOGIN, payload: { token, userId } }); 
    }else{
      dispatch({type: LOGOUT}); 
    }
  }, []);

  
  const login = (token, userId) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId",userId);
    dispatch({ type: LOGIN, payload: { token, userId } });
  };

  const logout = () => {
    localStorage.remove("token");
    localStorage.remove("userId");
    dispatch({ type: LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
