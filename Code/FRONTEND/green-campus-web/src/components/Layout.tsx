import React from 'react';
import Navbar from './Navbar';

// Puedes importar tus estilos aquí
// import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative flex text-light-primary">
      <Navbar />
      <main className="overflow-y-hidden h-screen w-full bg-black">
        <div className="m-4">{children}</div>
      </main>
    </div>
  );
};

export default Layout;