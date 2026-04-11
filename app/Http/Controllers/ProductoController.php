<?php

namespace App\Http\Controllers; // <--- ESTO ES VITAL: Debe decir \Api al final

use App\Http\Controllers\Controller; // <--- IMPORTANTE: Para que encuentre el controlador base
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    public function index()
    {
        // Intentamos cargar con relaciones para que React vea "Marca" y "Categoría"
        try {
            return Producto::with(['marca', 'categoria', 'proveedor'])->get();
        } catch (\Exception $e) {
            // Si las relaciones fallan, mandamos solo los productos para que no se caiga la app
            return Producto::all(); 
        }
        
    }

    public function store(Request $request)
        {
            try {
                // Intentamos crear el producto
                $producto = \App\Models\Producto::create($request->all());
                return response()->json($producto, 201);
            } catch (\Exception $e) {
                // Si falla, nos va a decir exactamente POR QUÉ (columna, ID, etc.)
                return response()->json([
                    'status' => 'error',
                    'message' => $e->getMessage()
                ], 500);
            }
        }
    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update($request->all());
        return $producto;
    }

    public function destroy($id)
    {
        return Producto::destroy($id);
    }
}