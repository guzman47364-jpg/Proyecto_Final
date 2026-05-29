import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ShopLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* 1. Navbar arriba del todo */}
            <Navbar />
            
            {/* 2. Contenedor principal de la tienda (Ocupa todo el ancho limpio) */}
            <main className="w-full max-w-7xl mx-auto my-6 px-4 flex-grow">
                <Outlet /> 
            </main>
        </div>
    );
};

export default ShopLayout;