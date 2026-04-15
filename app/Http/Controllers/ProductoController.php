<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // 1. Si es Vendedor: Solo ve SUS productos para gestionarlos
        if ($user && $user->hasRole('Vendedor')) {
            return Producto::where('user_id', $user->id)
                ->with(['marca', 'categoria', 'proveedor'])
                ->get();
        }

        // 2. Si es Admin o Comprador (o no está logueado): Ve TODO el catálogo
        return Producto::with(['marca', 'categoria', 'proveedor'])->get();
    }

    public function store(Request $request)
    {
        // Validamos los datos básicos
        $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'categoria_id' => 'required|exists:categorias,id',
            'marca_id' => 'required|exists:marcas,id',
        ]);

        try {
            // SEGURIDAD: Forzamos que el user_id sea el del usuario que inició sesión
            $data = $request->all();
            $data['user_id'] = Auth::id(); 

            $producto = Producto::create($data);
            
            return response()->json([
                'message' => 'Producto creado con éxito',
                'producto' => $producto
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear: ' . $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $user = Auth::user();

        // SEGURIDAD: Un vendedor no puede editar productos de otros
        if ($user->hasRole('Vendedor') && $producto->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para editar este producto'], 403);
        }

        $producto->update($request->all());
        return response()->json($producto);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $user = Auth::user();

        // SEGURIDAD: Un vendedor no puede borrar productos de otros
        if ($user->hasRole('Vendedor') && $producto->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso para eliminar este producto'], 403);
        }

        $producto->delete();
        return response()->json(['message' => 'Producto eliminado']);
    }
}