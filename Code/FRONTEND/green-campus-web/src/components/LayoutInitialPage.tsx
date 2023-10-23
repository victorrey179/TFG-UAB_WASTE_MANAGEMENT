import React from "react";
import NavbarInitialPage from "./NavbarInitialPage";
import backgroundImage from "../images/bgInitialPage2.png";
interface LayoutInitialPageProps {
  children: React.ReactNode;
}

const LayoutInitialPage: React.FC<LayoutInitialPageProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <NavbarInitialPage />
      <main
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
        }}
        className="overflow-y-hidden h-screen w-full"
      >
        <div className="mt-16 p-4 ">{children}</div>
      </main>
    </div>
  );
};
export default LayoutInitialPage;
