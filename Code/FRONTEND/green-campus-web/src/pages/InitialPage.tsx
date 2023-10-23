import React from 'react';
import LayoutInitialPage from '../components/LayoutInitialPage';
import { useNavigate } from 'react-router-dom';  // Importa useNavigate

export default function InitialPage() {
  const navigate = useNavigate();  // Inicializa useNavigate

  const handleStartClick = () => {
    navigate('/auth');  // Redirecciona a la página auth
  };

  return (
    <LayoutInitialPage>
        <div className="flex flex-col items-start justify-center w-3/5 h-full mt-40">
            <div className="flex flex-col text-left mb-5">
                <h1 className='text-7xl font-bold text-white'>Green Campus</h1>
                <h2 className='mt-2 text-4xl font-bold text-white'>El software para la gestión de residuos inteligentes.</h2>
            </div>
            <button 
              onClick={handleStartClick}  // Añade un manejador de clics al botón
              className="bg-white text-black font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out hover:bg-gray-400"
            >
                Comenzar
            </button>
        </div>
    </LayoutInitialPage>
  )
}
