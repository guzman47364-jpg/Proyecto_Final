<?php

namespace App\Observers;

use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Models\Inventario;

class DetalleVentaObserver
{
    public function created(DetalleVenta $detalleVenta)
    {
        // Usamos \Log para evitar errores de importación
        \Log::info("PASO 1: El Observer detectó un nuevo detalle. ID: " . $detalleVenta->id);

        $producto = Producto::find($detalleVenta->producto_id);

        if ($producto) {
            \Log::info("PASO 2: Producto encontrado: " . $producto->nombre . " Stock actual: " . $producto->stock);
            
            // Realizamos la resta
            $producto->decrement('stock', $detalleVenta->cantidad);
            
            \Log::info("PASO 3: Intento de decremento realizado. Cantidad: " . $detalleVenta->cantidad);

            // Creamos el registro en Kardex
            Inventario::create([
                'producto_id' => $detalleVenta->producto_id,
                'user_id' => $detalleVenta->venta->user_id, // En lugar de Auth::id(), usamos el de la venta ya creada
                'cantidad'    => $detalleVenta->cantidad,
                'tipo'        => 'salida',
                'descripcion' => "Venta #" . $detalleVenta->venta_id
            ]);
            
            \Log::info("PASO 4: Fila creada en tabla inventarios.");
        } else {
            // Corregido aquí también con \Log
            \Log::error("PASO ERROR: No se encontró el producto con ID: " . $detalleVenta->producto_id);
        }
    }
}