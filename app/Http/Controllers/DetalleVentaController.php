<?php

namespace App\Http\Controllers;

use App\Models\DetalleVenta;
use Illuminate\Http\Request;

class DetalleVentaController extends Controller
{
    /**
     * Muestra los detalles de una venta específica.
     * Útil para cuando en React haces clic en "Ver más" de un pedido.
     */
    public function showByVenta($ventaId)
    {
        $detalles = DetalleVenta::with('producto')
            ->where('venta_id', $ventaId)
            ->get();

        if ($detalles->isEmpty()) {
            return response()->json(['message' => 'No se encontraron detalles para esta venta'], 404);
        }

        return response()->json($detalles);
    }

    /**
     * (Opcional) Listado general de movimientos de productos.
     */
    public function index()
    {
        return DetalleVenta::with(['producto', 'venta.cliente'])->latest()->get();
    }
}