import React from "react";
import { connectSSE } from "../utils";

const defaultContext = { SSEClient: null };

export const SSEContext = React.createContext(defaultContext);

export const SSEContextProvider = ({ children }) => {
  const value = { SSEClient: connectSSE() };

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
};

export const useSSEState = () => React.useContext(SSEContext);
