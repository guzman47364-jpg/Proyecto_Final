import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ShopLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                {/* Aquí es donde React Router inyectará Productos, Categorías u Ofertas */}
                <Outlet />
            </main>
        </div>
    );
};

export default ShopLayout;