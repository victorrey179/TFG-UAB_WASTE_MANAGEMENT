import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

const NavbarLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ to, children, className = "", onClick }) => {
  const currentPage = useLocation().pathname;

  return (
    <li
      className={`${className} relative list-none font-roboto my-auto px-6 py-3 rounded-3xl text-light-primary ${
        currentPage === to && `bg-primary`
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
  const [isSubmenuOpen, setSubmenuOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isNavbarExpanded, setIsNavbarExpanded] = useState(true);
  const shrinkTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    <div
      className="relative bg-dark-primary"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`navbar relative flex flex-col justify-between bg-dark-primary h-screen py-10 transition-all duration-500 ease-in-out ${
          isNavbarExpanded ? "w-40" : "w-20"
        }`}
      >
        <div className="relative mx-auto">
          <ul className="py-5 ">
            <NavbarLink to="/">
              <HomeOutlinedIcon
                fontSize="small"
                className="text-light-primary"
              />
              {isNavbarExpanded && (
                <span className="text-light-primary">Inicio</span>
              )}
            </NavbarLink>
            <hr className="my-3 border-transparent text-light-primary" />
            <li>
              <NavbarLink to="/map">
                <MapOutlinedIcon
                  fontSize="small"
                  className="text-light-primary"
                />
                {isNavbarExpanded && (
                  <span className="text-light-primary">Mapa</span>
                )}
              </NavbarLink>
            </li>
          </ul>
        </div>
        <div className="relative mx-auto flex flex-col gap-4">
          {/* <div className="profile-btn relative mx-auto  bg-light-primary dark:bg-dark-primary h-16 w-16 rounded-full items-center flex justify-center">
            <ChatOutlinedIcon />
          </div> */}
          <NavbarLink to="/profile">
            <AccountCircleOutlinedIcon
              fontSize="small"
              className="text-light-primary"
            />
            {isNavbarExpanded && (
              <span className="text-light-primary">Perfil</span>
            )}
          </NavbarLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
