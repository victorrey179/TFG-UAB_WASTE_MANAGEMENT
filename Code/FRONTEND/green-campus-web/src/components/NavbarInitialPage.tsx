import React from "react";
import { Link, useLocation } from "react-router-dom";


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
      <Link to={to} className="flex items-center gap-3 relative pb-2 group">
        {" "}
        {/* Añadido clase group */}
        {children}
        {/* Línea debajo del texto */}
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
  const location = useLocation();  // Obtén la ubicación actual

  return (
    <div className="w-full fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo or Branding */}
        <NavbarInitialPageLink to="/">
          <span className="text-white font-bold text-xl">Green Campus</span>
        </NavbarInitialPageLink>
        {/* Navigation Links */}
        <ul className="flex space-x-4">
          <NavbarInitialPageLink to="/aboutus">
            <span className="text-light-primary">Sobre Nosotros</span>
          </NavbarInitialPageLink>
          <NavbarInitialPageLink to="/service">
            <span className="text-light-primary">Servicios</span>
          </NavbarInitialPageLink>
          {location.pathname !== "/" && (  // Condición para mostrar el ítem del menú
            <NavbarInitialPageLink to="/auth">
              <span className="text-light-primary">¡Empecemos!</span>
            </NavbarInitialPageLink>
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavbarInitialPage;
