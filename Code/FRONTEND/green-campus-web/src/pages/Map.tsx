import React, { useEffect, useState } from "react";
import { GoogleMap } from "@react-google-maps/api";
import Layout from "../components/Layout";

const Map: React.FC = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const mapStyles = {
    height: "100vh",
    width: "100%"
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error obteniendo la ubicación: ", error);
          // En caso de error o si el usuario no otorga permisos,
          // puedes establecer una ubicación predeterminada.
          setCenter({ lat: 41.3851, lng: 2.1734 });
        }
      );
    } else {
      // La geolocalización no está disponible, establece una ubicación predeterminada
      setCenter({ lat: 41.3851, lng: 2.1734 });
    }
  }, []);

  return (
    <Layout>
      <div>
        {center && (
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={13}
            center={center}
          />
        )}
      </div>
    </Layout>
  );
};

export default Map;
