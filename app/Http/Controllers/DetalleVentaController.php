<?php

namespace App\Http\Controllers;

use App\Models\DetalleVenta;
use Illuminate\Http\Request;

class DetalleVentaController extends Controller
{
    
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

    
    public function index()
    {
        return DetalleVenta::with(['producto', 'venta.cliente'])->latest()->get();
    }
}