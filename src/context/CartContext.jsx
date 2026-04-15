import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    // Añadir al carrito
    const addToCart = (product) => {
        setCart((prevCart) => {
            const isItemInCart = prevCart.find((item) => item.id === product.id);
            if (isItemInCart) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Calcular total de productos para el circulito del Navbar
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, totalItems }}>
            {children}
        </CartContext.Provider>
    );
};