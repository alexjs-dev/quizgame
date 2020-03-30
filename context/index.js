import React, { createContext, useReducer } from 'react';
import reducer from './reducer';

const initialState = {
  players: [],
};

const Context = createContext(initialState);
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <Context.Provider value={[state, dispatch]}>
      {children}
    </Context.Provider>
  )
};

const ContextConsumer = Context.Consumer;

export default ContextProvider;
export { ContextConsumer, Context };