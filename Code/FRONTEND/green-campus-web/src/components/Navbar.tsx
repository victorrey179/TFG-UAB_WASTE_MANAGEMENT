import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const NavbarLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className = "", onClick }) => {
  const currentPage = useLocation().pathname;

  return (
    <li
      className={`${className} relative list-none font-roboto my-auto px-6 py-3 rounded-2xl text-light-primary ${
        currentPage === to && to !== '/profile' && `bg-primary`
      }`}
      onClick={onClick}
    >
      <Link to={to} className="flex items-center gap-3">
        {children}
      </Link>
    </li>
  );
};

const Navbar = () => {
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const shrinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  const handleMouseOver = () => {
    if (shrinkTimerRef.current) {
      clearTimeout(shrinkTimerRef.current);
      shrinkTimerRef.current = null;
    }
    const delay = 200; // Tiempo de retraso en milisegundos (500 ms)
    shrinkTimerRef.current = setTimeout(() => {
      setIsNavbarExpanded(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (shrinkTimerRef.current) {
      clearTimeout(shrinkTimerRef.current);
      shrinkTimerRef.current = null;
    }
    shrinkTimerRef.current = setTimeout(() => {
      setIsNavbarExpanded(false);
    }, 2000); // Retraso de 5 segundos
  };

  return (
    <div className="relative bg-black">
      <div
        className={`navbar ml-2 mb-2 relative flex flex-col rounded-2xl justify-between bg-dark-primary h-screen py-10 transition-all duration-500 ease-in-out ${
          isNavbarExpanded ? "w-40" : "w-20"
        }`}
        onMouseOver={handleMouseOver}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative mx-auto">
          <ul className="py-5 ">
            <NavbarLink to="/home">
              <HomeOutlinedIcon
                fontSize="small"
                className="text-light-primary"
              />
              {isNavbarExpanded && (
                <span className="text-light-primary">Inicio</span>
              )}
            </NavbarLink>
            <hr className="my-3 border-transparent text-light-primary" />
            <NavbarLink to="/map">
              <MapOutlinedIcon
                fontSize="small"
                className="text-light-primary"
              />
              {isNavbarExpanded && (
                <span className="text-light-primary">Mapa</span>
              )}
            </NavbarLink>
          </ul>
        </div>
        <div className="relative mx-auto flex flex-row items-center">
          <NavbarLink to="/profile">
            {user && user.photoURL ? (
              <img
                src={user.photoURL}
                alt={`${user.displayName}`}
                className="rounded-full w-8 h-8" // Ajusta el tamaño según sea necesario
              />
            ) : (
              <AccountCircleOutlinedIcon
                fontSize="small"
                className="text-light-primary"
              />
            )}
            {isNavbarExpanded && (
              <div className="w-20 truncate text-center">
                <h1 className="text-sm text-light-primary">
                  {user ? user.displayName : "Perfil"}
                </h1>
              </div>
            )}
          </NavbarLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
