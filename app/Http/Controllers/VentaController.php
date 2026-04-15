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
    // Este método crea la venta y descuenta el stock
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
                $lineasDetalle = [];

                foreach ($request->productos as $item) {
                    $producto = Producto::lockForUpdate()->find($item['id']);

                    // Validar si hay suficiente stock
                    if ($producto->stock < $item['cantidad']) {
                        throw new \Exception("Stock insuficiente para el producto: {$producto->nombre}");
                    }

                    $subtotal = $producto->precio * $item['cantidad'];
                    $totalVenta += $subtotal;

                    // RESTAR STOCK
                    $producto->decrement('stock', $item['cantidad']);

                    $lineasDetalle[] = [
                        'producto_id' => $producto->id,
                        'cantidad' => $item['cantidad'],
                        'precio_unitario' => $producto->precio,
                        'subtotal' => $subtotal
                    ];
                }

                // Crear la Venta (Cabecera)
                $venta = Venta::create([
                    'user_id' => Auth::id(), // El ID del comprador logueado
                    'total' => $totalVenta,
                    'estado' => 'pagado',
                    'metodo_pago' => $request->metodo_pago ?? 'tarjeta'
                ]);

                // Crear los detalles
                foreach ($lineasDetalle as $detalle) {
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

    // Para que el Vendedor o Admin vea el historial
    public function index()
    {
        return Venta::with(['cliente', 'detalles.producto'])->get();
    }
}