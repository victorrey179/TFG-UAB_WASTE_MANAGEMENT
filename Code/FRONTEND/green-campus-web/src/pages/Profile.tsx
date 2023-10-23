import React from "react";
import Layout from "../components/Layout";
import { useAuth } from "../contexts/AuthContext";  // Importa useAuth

const Profile: React.FC = () => {
  const { handleSignOut, user } = useAuth();  // Accede a handleSignOut usando useAuth

  return (
    console.log(user),
    <Layout>
      <div>
        <button onClick={handleSignOut}>Cerrar Sesión</button>  {/* Botón para cerrar sesión */}
      </div>
    </Layout>
  );
};

export default Profile;
