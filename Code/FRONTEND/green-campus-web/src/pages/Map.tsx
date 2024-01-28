import React, { useEffect, useState } from "react";
import { DirectionsRenderer, GoogleMap, Marker } from "@react-google-maps/api";
import Layout from "../components/Layout";
import { GridLoader } from "react-spinners";
import { useServerContext } from "../contexts/ServerContext";

type Coords = {
  lat: number;
  lng: number;
};


const Map: React.FC = () => {
  const { pointsToBeCollected } = useServerContext();
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [waypoints, setWaypoints] = useState<Coords[]>([]);
  useEffect(() => {
    if (pointsToBeCollected && pointsToBeCollected.length > 0) {
      
      const newWaypoints: Coords[] = pointsToBeCollected.map(point => ({
        lat: point.coordinates[0], // Asegúrate de que estos nombres de campo coincidan con la estructura de tus datos
        lng: point.coordinates[1],
      }));
      
      setWaypoints(newWaypoints);
      
      // Si necesitas buscar direcciones inmediatamente después de actualizar waypoints, puedes hacerlo aquí
      if (newWaypoints.length >= 2) {
        fetchDirections(newWaypoints);
      }
    }
  }, [pointsToBeCollected]);
  
  const fetchDirections = (waypoints: Coords[]) => {
    const directionsService = new google.maps.DirectionsService();

    const origin = waypoints[0]; // El punto de inicio
    const destination = waypoints[waypoints.length - 1]; // El punto final
    const waypointsIntermediate = waypoints
      .slice(1, waypoints.length - 1)
      .map((waypoint) => ({
        location: waypoint,
        stopover: true,
      }));

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        waypoints: waypointsIntermediate,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        console.log(result); // Agrega esto para depurar
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result);
        } else {
          console.error(`Error al obtener direcciones: ${status}`);
        }
      }
    );
  };

  useEffect(() => {
    // Asegúrate de que los waypoints estén definidos antes de llamar a fetchDirections
    if (waypoints.length >= 2) {
      fetchDirections(waypoints);
    }
  }, [waypoints]);
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

  const whiteMarkerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE, // Esto crea un círculo, puedes usar otras formas
    scale: 5, // Tamaño del marcador
    fillColor: "#FFFFFF", // Color blanco para el relleno
    fillOpacity: 0.8,
    strokeColor: "#FFFFFF", // Color blanco para el borde
    strokeWeight: 1,
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
          setCenter({ lat: 41.3851, lng: 2.19 });
        }
      );
    } else {
      // La geolocalización no está disponible, establece una ubicación predeterminada
      setCenter({ lat: 41.3851, lng: 2.19 });
    }
  }, []);

  const markerColor = "#394c9a"; // Cambia esto por el color que desees
  const markerIcon = {
    path: window.google.maps.SymbolPath.CIRCLE, // Esto crea un círculo, puedes usar otras formas
    scale: 8, // Tamaño del marcador
    fillColor: markerColor,
    fillOpacity: 0.5,
    strokeColor: markerColor,
    strokeWeight: 0.2,
  };

  const mapOptions = {
    styles: customMapStyle, // Configura el idioma del mapa
  };

  return (
    <Layout>
      <div className="mr-4 ml-4">
        {!mapLoaded && (
          <div className="flex items-center justify-center min-h-screen bg-transparent bg-opacity-50">
            <GridLoader color="#394c9a" loading={!mapLoaded} size={10} />
          </div>
        )}
        {center && (
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={15}
            center={center}
            onLoad={() => setMapLoaded(true)}
            options={mapOptions}
          >
            <Marker
              position={center}
              icon={markerIcon} // Añade la prop icon aquí
            />
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  markerOptions: {
                    icon: whiteMarkerIcon, // Usar el icono personalizado aquí
                  },
                }}
              />
            )}
          </GoogleMap>
        )}
      </div>
    </Layout>
  );
};

export default Map;
