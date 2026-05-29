import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext'; 
import { AuthContext } from '../../context/AuthContext'; 
import Swal from 'sweetalert2';

const CheckoutButton = ({ cartTotal }) => {
    const { user } = useContext(AuthContext);
    const { cart, clearCart } = useContext(CartContext);
    const navigate = useNavigate(); 

    const handleCheckout = () => {
        if (!user) {
            Swal.fire({
                title: '¡Espera un momento!',
                text: 'Para finalizar tu compra necesitas iniciar sesión.',
                icon: 'warning',
                confirmButtonColor: '#4f46e5',
                confirmButtonText: '🔑 Iniciar Sesión',
            });
            return;
        }

        Swal.fire({
            title: 'Pago por Transferencia Bancaria',
            icon: 'info',
            html: `
                <div style="text-align: left; background-color: #f9fafb; padding: 15px; border-radius: 12px; font-size: 14px; margin-bottom: 15px;">
                    <p style="margin: 4px 0;"><strong>Banco:</strong> Banco Agrícola</p>
                    <p style="margin: 4px 0;"><strong>Tipo de Cuenta:</strong> Corriente</p>
                    <p style="margin: 4px 0;"><strong>Número de Cuenta:</strong> 540-123456-7</p>
                    <p style="margin: 4px 0;"><strong>A nombre de:</strong> F&B Fashion S.A. de C.V.</p>
                    <p style="margin: 8px 0 0 0; color: #4f46e5; font-weight: bold;">Monto Exacto a Transferir: $${cartTotal.toFixed(2)}</p>
                </div>
                <label style="display: block; font-weight: 600; font-size: 14px; margin-bottom: 8px; text-align: left; color: #374151;">
                    Sube la captura o foto de tu comprobante:
                </label>
            `,
            input: 'file',
            inputAttributes: {
                'accept': 'image/*',
                'aria-label': 'Sube tu comprobante de transferencia'
            },
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#ef4444',
            confirmButtonText: '🚀 Enviar Comprobante',
            cancelButtonText: 'Cancelar',
            preConfirm: (file) => {
                if (!file) {
                    Swal.showValidationMessage('Es obligatorio subir el comprobante para procesar la orden');
                }
                return file;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const comprobanteArchivo = result.value;

                // Pantalla de carga mientras Laravel procesa la transacción
                Swal.fire({
                    title: 'Procesando tu orden...',
                    text: 'Subiendo comprobante y guardando la venta en el sistema.',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    // Empaquetamos los datos acoplados a tus modelos de Laravel
                    const formData = new FormData();
                    formData.append('comprobante', comprobanteArchivo);
                    formData.append('total', cartTotal);
                    formData.append('productos', JSON.stringify(cart)); 
                    formData.append('user_id', user.id); // <-- Corregido para que machee con tu modelo Venta

                    // Recuperamos el Token JWT de tu almacenamiento local
                    const token = localStorage.getItem('token'); 
                    
                    // Conectamos directo al endpoint nativo 'api/ventas' por POST
                    const response = await fetch('http://localhost:8000/api/ventas', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`
                            // Nota: Con FormData NO declaramos Content-Type, el navegador gestiona los boundaries solo
                        },
                        body: formData
                    });

                    const data = await response.json();

                    if (response.ok) {
                        // Venta registrada con éxito en Laravel e insertada en Postgres
                        await Swal.fire({
                            title: '¡Venta Registrada Exitosamente!',
                            text: 'Tu comprobante ha sido subido. Redirigiendo a la página de inicio...',
                            icon: 'success',
                            confirmButtonColor: '#4f46e5',
                            timer: 3000
                        });
                        
                        clearCart(); // Vaciamos el estado global del carrito en React
                        navigate('/shop'); // Mandamos al cliente al inicio de la tienda
                    } else {
                        throw new Error(data.message || 'Error en el servidor');
                    }

                } catch (error) {
                    Swal.fire({
                        title: 'Error al registrar la venta',
                        text: error.message || 'No se pudo comunicar con el servidor.',
                        icon: 'error',
                        confirmButtonColor: '#ef4444'
                    });
                }
            }
        });
    };

    return (
        <button 
            onClick={handleCheckout} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all duration-150 text-sm text-center block"
        >
            Finalizar Compra
        </button>
    );
};

export default CheckoutButton;