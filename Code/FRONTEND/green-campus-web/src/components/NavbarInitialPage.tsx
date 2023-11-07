import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/logobluecampus_white.png";
import { useLanguage } from "../contexts/LanguageContext";
import spanishFlag from "../images/spanishFlag.svg";
import englishFlag from "../images/englishFlag.svg";
import catalanFlag from "../images/catalanFlag.svg";
import AboutUs from "../pages/AboutUs";

interface LanguageDropdownProps {
  setShowDropdown: (show: boolean) => void;
}

const LanguageDropdown: React.FC<LanguageDropdownProps> = ({
  setShowDropdown,
}) => {
  const { handleLanguage, text } = useLanguage();
  return (
    <div className="absolute top-full left-0 mt-2 bg-black shadow-lg rounded z-1">
      <ul>
        <li
          onClick={() => {
            handleLanguage("es");
            setShowDropdown(false);
          }}
          className="flex items-center" // Añadido flexbox aquí
        >
          <img
            src={spanishFlag}
            alt="Spanish Flag"
            className="mr-2"
            width="20"
            height="15"
          />{" "}
          {/* Tamaño modificado */}
          {text("language.es")}
        </li>
        <li
          onClick={() => {
            handleLanguage("en");
            setShowDropdown(false);
          }}
          className="flex items-center" // Añadido flexbox aquí
        >
          <img
            src={englishFlag}
            alt="English Flag"
            className="mr-2"
            width="20"
            height="15"
          />{" "}
          {/* Tamaño modificado */}
          {text("language.en")}
        </li>
        <li
          onClick={() => {
            handleLanguage("ca");
            setShowDropdown(false);
          }}
          className="flex items-center" // Añadido flexbox aquí
        >
          <img
            src={catalanFlag}
            alt="Catalan Flag"
            className="mr-2"
            width="20"
            height="15"
          />{" "}
          {/* Tamaño modificado */}
          {text("language.ca")}
        </li>
      </ul>
    </div>
  );
};

const NavbarInitialPageLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className = "", onClick }) => {
  const currentPage = useLocation().pathname;

  return (
    <li
      className={`${className} relative list-none font-roboto my-auto px-6 py-3 text-light-primary`}
      onClick={onClick}
    >
      <Link
        to={to === "/language" ? currentPage : to}
        className="flex items-center gap-3 relative pb-2 group"
      >
        {children}
        <div
          className={`
          absolute inset-x-0 bottom-0 h-1 bg-white 
          transform transition-transform duration-300 ${
            currentPage === to && to !== "/" ? "scale-x-100" : "scale-x-0"
          } ${to !== "/" ? "origin-left group-hover:scale-x-100" : ""}
        `}
        ></div>
      </Link>
    </li>
  );
};

const NavbarInitialPage = () => {
  const location = useLocation(); // Obtén la ubicación actual
  const isHomePage = location.pathname === "/";
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const { text } = useLanguage();

  return (
    <div className="w-full fixed top-0 z-50 flex flex-col">
      <div
        className={`container flex justify-between items-center ${
          isHomePage ? "p-1" : "p-4"
        }`}
      >
        {/* Logo or Branding */}
        <NavbarInitialPageLink to="/">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-300 ${
                isHomePage ? "w-18 h-16" : "w-12 h-10"
              } mr-2`}
            />
            {!isHomePage && (
              <span className="text-white font-bold text-xl">Blue Campus</span>
            )}
          </div>
        </NavbarInitialPageLink>
        <ul className="flex ">
          <NavbarInitialPageLink
            to="/language"
            className={showLanguageDropdown ? "relative" : ""}
          >
            <span
              className="text-light-primary"
              onMouseEnter={() => setShowLanguageDropdown(true)}
              onMouseLeave={() => setShowLanguageDropdown(true)}
            >
              {text("languageButton.text")}
            </span>
            {showLanguageDropdown && (
              <LanguageDropdown setShowDropdown={setShowLanguageDropdown} />
            )}
          </NavbarInitialPageLink>
          <NavbarInitialPageLink to="/aboutus">
            <span className="text-light-primary">
              {text("aboutUsButton.text")}
            </span>
          </NavbarInitialPageLink>
          <NavbarInitialPageLink to="/service">
            <span className="text-light-primary">
              {text("servicesButton.text")}
            </span>
          </NavbarInitialPageLink>
          {location.pathname !== "/" && ( // Condición para mostrar el ítem del menú
            <NavbarInitialPageLink to="/auth">
              <span className="text-light-primary">
                {text("loginPageButton.text")}
              </span>
            </NavbarInitialPageLink>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavbarInitialPage;
