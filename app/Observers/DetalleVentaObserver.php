<?php

namespace App\Observers;

use App\Models\DetalleVenta;

class DetalleVentaObserver
{
    /**
     * Handle the DetalleVenta "created" event.
     */
    public function created(DetalleVenta $detalleVenta)
{
    // 1. Restar del stock general
    $producto = $detalleVenta->producto;
    $producto->decrement('stock', $detalleVenta->cantidad);

    // 2. Crear el historial en tu nueva tabla de inventarios
    \App\Models\Inventario::create([
        'producto_id' => $detalleVenta->producto_id,
        'user_id'     => auth()->id() ?? 1, // El usuario que está logueado
        'cantidad'    => $detalleVenta->cantidad,
        'tipo'        => 'salida',
        'descripcion' => "Venta #" . $detalleVenta->venta_id
    ]);
}
}
