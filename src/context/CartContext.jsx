import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // 1. Inicializar con LocalStorage para que no se borre al actualizar la página
    const [cart, setCart] = useState(() => {
        const localData = localStorage.getItem('cart_tienda');
        return localData ? JSON.parse(localData) : [];
    });

    // 2. Guardar automáticamente en LocalStorage cuando cambie el carrito
    useEffect(() => {
        localStorage.setItem('cart_tienda', JSON.stringify(cart));
    }, [cart]);

    // Añadir al carrito (Cambiado a 'cantidad' para sincronizar con Laravel)
    const addToCart = (product) => {
        setCart((prevCart) => {
            const isItemInCart = prevCart.find((item) => item.id === product.id);
            if (isItemInCart) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
                );
            }
            return [...prevCart, { ...product, cantidad: 1 }];
        });
    };

    // NUEVO: Modificar cantidades directamente desde el input del carrito
    const updateCantidad = (id, cantidad) => {
        if (cantidad < 1) return;
        setCart(cart.map(item => item.id === id ? { ...item, cantidad } : item));
    };

    // NUEVO: Eliminar un producto específico del carrito
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    // NUEVO: Limpiar todo el carrito (Se usa al vaciar o al terminar la compra)
    const clearCart = () => {
        setCart([]);
    };

    // Tu función original: Total de productos para el circulito del Navbar
    const totalItems = cart.reduce((total, item) => total + item.cantidad, 0);

    // NUEVO: Calcular el dinero total acumulado de la compra
    const cartTotal = cart.reduce((total, item) => total + (item.precio * item.cantidad), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            updateCantidad, 
            removeFromCart, 
            clearCart, 
            totalItems, 
            cartTotal 
        }}>
            {children}
        </CartContext.Provider>
    );
};