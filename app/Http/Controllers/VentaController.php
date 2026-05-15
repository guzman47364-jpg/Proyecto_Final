<?php

namespace App\Http\Controllers;

use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VentaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'productos' => 'required|array',
            'productos.*.id' => 'required|exists:productos,id',
            'productos.*.cantidad' => 'required|integer|min:1',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                $totalVenta = 0;
                $detallesParaCrear = [];

                // 1. Validar Stock y calcular totales antes de tocar la base de datos
                foreach ($request->productos as $item) {
                    $producto = Producto::lockForUpdate()->find($item['id']);

                    if ($producto->stock < $item['cantidad']) {
                        throw new \Exception("Stock insuficiente para: {$producto->nombre}");
                    }

                    $subtotal = $producto->precio * $item['cantidad'];
                    $totalVenta += $subtotal;

                    // Guardamos los datos listos para insertar después
                    $detallesParaCrear[] = [
                        'producto_id' => $producto->id,
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $producto->precio,
                        'subtotal' => $subtotal
                    ];
                }

                // 2. Crear la Venta (Cabecera)
                // En VentaController.php
                $venta = Venta::create([
                    'user_id' => auth()->user()->id, // Forzamos a que use el ID del token
                    'total' => $totalVenta,
                    'estado' => 'pagado',
                    'metodo_pago' => $request->metodo_pago ?? 'efectivo'
                ]);

                // 3. Crear los detalles
                // Al ejecutarse DetalleVenta::create, el OBSERVER se activará 
                // automáticamente para restar stock y llenar el Kardex.
                foreach ($detallesParaCrear as $detalle) {
                    $detalle['venta_id'] = $venta->id;
                    DetalleVenta::create($detalle); 
                }

                return response()->json([
                    'message' => '¡Venta procesada con éxito!',
                    'venta' => $venta->load('detalles.producto')
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 400);
        }
    }

    public function index()
    {
        return Venta::with(['cliente', 'detalles.producto'])->get();
    }
}