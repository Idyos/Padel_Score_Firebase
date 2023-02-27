import { createContext, useState } from "react";

// Utilitzar aquest context cada cop que necessitem accedir al model
export const DarkLightContext = createContext();

// Posar aquest component com a component arrel (a dalt de tot de l'arbre)
export const DarkLightTheme = ({ children }) => {
  // Totes les dades de l'aplicació van aquí
  const [darkMode, setDarkMode] = useState(false);

  return (
    <DarkLightContext.Provider
      value={{
        darkMode: darkMode,
        setDarkMode,
      }}
    >
      {children}
    </DarkLightContext.Provider>
  );
};