import React from 'react';
import { useServerContext } from "../../contexts/ServerContext";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Zone: React.FC = () => {
  const { zones, currentZoneIndex, nextZone, prevZone } = useServerContext();
  console.log(zones);

  if (!zones || zones.length === 0) {
    return <div className="loading-container rounded-xl"></div>;
  }
  return (
    <div className="flex items-center justify-between w-full p-2">
      <button onClick={prevZone} aria-label="Previous zone" className="flex-initial">
        <ArrowBackIosNewIcon />
      </button>
      <div className="flex-grow text-center">
        {/* Asegúrate de que currentZoneIndex no está fuera de rango */}
        <h2 className="text-xl font-bold">{zones[currentZoneIndex]}</h2>
        
      </div>
      <button onClick={nextZone} aria-label="Next zone" className="flex-initial">
        <ArrowForwardIosIcon />
      </button>
    </div>
  );
};

export default Zone;
