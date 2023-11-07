import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

interface LanguageContextProps {
  language: string;
  text: (key: string) => string;
  handleLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: "es", // idioma predeterminado
  text: (key: string) => key,
  handleLanguage: () => {},
});

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("appLanguage") || "es"; // 'es' es el idioma predeterminado
  });
  const [t, i18n] = useTranslation(["global"]);

  useEffect(() => {
    i18n.changeLanguage(language); // Cambiar el idioma en i18next cuando el estado del idioma cambie
    localStorage.setItem("appLanguage", language); // Guardar el idioma en localStorage
  }, [language, i18n]);

  const handleLanguage = (language: string) => {
    setLanguage(language);
  };
  const text = (key: string) => {
    return t(key);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        text,
        handleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
