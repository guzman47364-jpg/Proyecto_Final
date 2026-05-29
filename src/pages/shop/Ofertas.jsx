import React from 'react';

const Ofertas = () => {
    // Aquí colocas las rutas de tus banners de ofertas
    // Puedes guardarlas en la carpeta public de tu React (ej: /images/oferta1.jpg)
    // O traerlas desde tu storage de Laragon si las manejas desde el Admin
    const promociones = [
        {
            id: 1,
            imagen: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop', // Imagen de ejemplo de ofertas
            titulo: 'Gran Liquidación de Temporada',
            descuento: 'Hasta 50% OFF',
            enlace: '/shop'
        },
        {
            id: 2,
            imagen: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1000&auto=format&fit=crop', // Imagen de ejemplo ropa/calzado
            titulo: 'Colección Urbana',
            descuento: '2x1 en Productos Seleccionados',
            enlace: '/shop'
        }
    ];

    return (
        <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Título de la sección */}
                <div className="mb-8 text-center sm:text-left">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        🔥 Ofertas Imperdibles
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Aprovecha los mejores descuentos de la semana en F&B Fashion.
                    </p>
                </div>

                {/* Grilla de Banners de Ofertas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {promociones.map((oferta) => (
                        <div 
                            key={oferta.id}
                            className="relative overflow-hidden rounded-2xl shadow-lg group bg-indigo-900 h-64 md:h-80 transition-all duration-300 hover:shadow-xl"
                        >
                            {/* Imagen de Fondo */}
                            <img 
                                src={oferta.imagen} 
                                alt={oferta.titulo}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-90"
                            />

                            {/* Capa de degrade oscuro para que resalte el texto */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                            {/* Contenido del Banner */}
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                                <span className="inline-block px-3 py-1 text-xs font-bold tracking-wider text-white uppercase bg-red-600 rounded-full w-max mb-2 animate-pulse">
                                    {oferta.descuento}
                                </span>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                                    {oferta.titulo}
                                </h3>
                                <div>
                                    <a 
                                        href={oferta.enlace}
                                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-gray-900 bg-white hover:bg-gray-100 rounded-xl transition-colors duration-150 shadow-md"
                                    >
                                        Ver Productos
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Ofertas;