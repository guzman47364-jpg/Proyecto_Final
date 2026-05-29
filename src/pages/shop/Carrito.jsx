import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext'; 
import CheckoutButton from './CheckoutButton'; 

const Carrito = () => {
    const { cart, removeFromCart, updateCantidad, cartTotal, clearCart } = useContext(CartContext);

    // Cálculos de IVA (13%)
    const subtotal = cartTotal / 1.13;
    const iva = cartTotal - subtotal;

    if (cart.length === 0) {
        return (
            <div className="w-full max-w-lg mx-auto mt-12 bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                <span className="text-5xl block mb-4">🛒</span>
                <h5 className="font-bold text-gray-700 text-xl">Tu carrito está vacío</h5>
                <p className="text-gray-400 text-sm mt-2">Explora la tienda y añade tus productos favoritos.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 my-6">
            {/* Contenedor Grid de Dos Columnas en Computadoras (lg) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* COLUMNA IZQUIERDA: Tabla de Productos (Toma 8 de 12 espacios) */}
                <div className="lg:col-span-8 w-full bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Tu Carrito de Compras</h2>
                    
                    {/* Contenedor de la Tabla */}
                    <div className="overflow-x-auto w-full mb-4">
                        <table className="w-full border-collapse text-left text-sm text-gray-600">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="bg-gray-50 text-gray-500 font-bold p-3 uppercase tracking-wider text-xs">Producto</th>
                                    <th className="bg-gray-50 text-gray-500 font-bold p-3 uppercase tracking-wider text-xs text-center">Precio</th>
                                    <th className="bg-gray-50 text-gray-500 font-bold p-3 uppercase tracking-wider text-xs text-center">Cantidad</th>
                                    <th className="bg-gray-50 text-gray-500 font-bold p-3 uppercase tracking-wider text-xs text-center">Subtotal</th>
                                    <th className="bg-gray-50 text-gray-500 font-bold p-3 uppercase tracking-wider text-xs text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        {/* Nombre del Producto */}
                                        <td className="p-4 align-middle">
                                            <span className="font-semibold text-gray-800 text-base block">{item.nombre}</span>
                                        </td>
                                        
                                        {/* Precio Unitario */}
                                        <td className="p-4 align-middle text-center font-medium text-gray-700">
                                            ${parseFloat(item.precio).toFixed(2)}
                                        </td>
                                        
                                        {/* Selector de Cantidad */}
                                        <td className="p-4 align-middle text-center">
                                            <input 
                                                type="number" 
                                                className="w-14 text-center border border-gray-200 rounded-lg p-1.5 font-semibold text-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                                                value={item.cantidad} 
                                                min="1"
                                                onChange={(e) => updateCantidad(item.id, parseInt(e.target.value) || 1)}
                                            />
                                        </td>
                                        
                                        {/* Subtotal de la fila */}
                                        <td className="p-4 align-middle text-center font-bold text-gray-900">
                                            ${(item.precio * item.cantidad).toFixed(2)}
                                        </td>
                                        
                                        {/* Botón Eliminar */}
                                        <td className="p-4 align-middle text-center">
                                            <button 
                                                className="text-gray-400 hover:text-red-500 font-bold p-2 text-base transition-colors duration-150"
                                                onClick={() => removeFromCart(item.id)}
                                                title="Eliminar del carrito"
                                            >
                                                ✕
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Botón Vaciar */}
                    <button 
                        className="text-xs text-red-500 hover:text-red-700 font-semibold underline transition-colors duration-150 mt-4 block" 
                        onClick={clearCart}
                    >
                        Vaciar todo el carrito
                    </button>
                </div>

                {/* COLUMNA DERECHA: Resumen de Facturación (Toma 4 de 12 espacios) */}
                <div className="lg:col-span-4 w-full bg-white p-6 rounded-2xl shadow-md border border-gray-100 text-gray-800">
                    <h5 className="font-bold text-lg text-gray-900 mb-5 pb-2 border-b border-gray-100">Resumen de Orden</h5>
                    
                    <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                        <span>Subtotal:</span>
                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                        <span>IVA (13%):</span>
                        <span className="font-medium text-gray-900">${iva.toFixed(2)}</span>
                    </div>
                    
                    <hr className="my-4 border-gray-100" />
                    
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-gray-800 text-base">Total a Pagar:</span>
                        <span className="text-2xl font-black text-indigo-600">${cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="w-full">
                        <CheckoutButton cartTotal={cartTotal} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Carrito;