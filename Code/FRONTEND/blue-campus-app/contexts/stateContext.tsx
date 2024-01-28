import React, { createContext, useReducer, ReactNode } from 'react';

interface State {
    activeTab: string;
    // Aquí puedes añadir más propiedades si las necesitas
  }
  
  interface Action {
    type: string;
    payload?: any; // Puedes ser más específico con el tipo si sabes qué tipo de datos vas a manejar
  }
  
  const initialState: State = {
    activeTab: 'home',
  };
  
  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'SET_ACTIVE_TAB':
        return { ...state, activeTab: action.payload };
      default:
        return state;
    }
  }

// Crear el contexto
export const StateContext = createContext<{
    state: State;
    dispatch: React.Dispatch<Action>;
  }>({
    state: initialState,
    dispatch: () => null, // Función vacía como valor inicial
  });
  
  export const StateProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    return (
      <StateContext.Provider value={{ state, dispatch }}>
        {children}
      </StateContext.Provider>
    );
  };
