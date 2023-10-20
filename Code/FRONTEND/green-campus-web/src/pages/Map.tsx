import React, { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import Layout from "../components/Layout";
import { GridLoader } from "react-spinners";

const Map: React.FC = () => {
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapStyles = {
    height: "100vh",
    width: "100%",
    borderRadius: "1rem",
  };

  const customMapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#212121",
        },
      ],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [
        {
          color: "#757575",
        },
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd",
        },
      ],
    },
    {
      featureType: "poi",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#181818",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1b1b1b",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#2c2c2c",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8a8a8a",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "geometry",
      stylers: [
        {
          color: "#373737",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#3c3c3c",
        },
      ],
    },
    {
      featureType: "road.highway.controlled_access",
      elementType: "geometry",
      stylers: [
        {
          color: "#4e4e4e",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "transit",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#000000",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3d3d3d",
        },
      ],
    },
  ];

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

  const markerColor = "#394c9a";  // Cambia esto por el color que desees
  const markerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,  // Esto crea un círculo, puedes usar otras formas
    scale: 8,  // Tamaño del marcador
    fillColor: markerColor,
    fillOpacity: 0.5,
    strokeColor: markerColor,
    strokeWeight: 0.2,
  };

  return (
    <Layout>
      <div>
        {!mapLoaded && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
            <GridLoader color="#394c9a" loading={!mapLoaded} size={10} />
          </div>
        )}
        {center && (
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={center}
            onLoad={() => setMapLoaded(true)}
            options={{ styles: customMapStyle }}
          >
            <Marker
              position={center}
              icon={markerIcon}  // Añade la prop icon aquí
            />
          </GoogleMap>
        )}
      </div>
    </Layout>
  );
};

export default Map;
