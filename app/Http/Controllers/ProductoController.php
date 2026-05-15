<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage; // Importante para borrar archivos

class ProductoController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if ($user && $user->hasRole('Vendedor')) {
            return Producto::where('user_id', $user->id)
                ->with(['marca', 'categoria', 'proveedor'])
                ->get();
        }

        return Producto::with(['marca', 'categoria', 'proveedor'])->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'categoria_id' => 'required|exists:categorias,id',
            'marca_id' => 'required|exists:marcas,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        try {
            $data = $request->all();
            $data['user_id'] = Auth::id(); 

            if ($request->hasFile('imagen')) {
                $file = $request->file('imagen');
                $nombreImagen = time() . '_' . $file->getClientOriginalName();
                $ruta = $file->storeAs('productos', $nombreImagen, 'public');
                $data['imagen'] = $ruta; 
            }

            $producto = Producto::create($data);
            
            \App\Models\Inventario::create([
                'producto_id' => $producto->id,
                'user_id'     => Auth::id() ?? 1,
                'cantidad'    => $producto->stock,
                'tipo'        => 'entrada',
                'descripcion' => "Ingreso inicial de mercadería: " . $producto->nombre
            ]);

            return response()->json([
                'message' => 'Producto creado con éxito',
                'producto' => $producto
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $user = Auth::user();

        if ($user->hasRole('Vendedor') && $producto->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso'], 403);
        }

        // 1. Validar (Igual que en store)
        $request->validate([
            'nombre' => 'required|string',
            'precio' => 'required|numeric',
            'categoria_id' => 'required|exists:categorias,id',
            'marca_id' => 'required|exists:marcas,id',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $data = $request->all();

        // 2. PROCESAR IMAGEN NUEVA SI VIENE EN EL EDIT
        if ($request->hasFile('imagen')) {
            // Opcional: Borrar la imagen anterior para no llenar el disco de basura
            if ($producto->imagen) {
                Storage::disk('public')->delete($producto->imagen);
            }

            $file = $request->file('imagen');
            $nombreImagen = time() . '_' . $file->getClientOriginalName();
            $ruta = $file->storeAs('productos', $nombreImagen, 'public');
            $data['imagen'] = $ruta;
        }

        // 3. Actualizar con los nuevos datos procesados
        $producto->update($data);
        
        return response()->json([
            'message' => 'Producto actualizado con éxito',
            'producto' => $producto
        ]);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $user = Auth::user();

        if ($user->hasRole('Vendedor') && $producto->user_id !== $user->id) {
            return response()->json(['message' => 'No tienes permiso'], 403);
        }

        // Borrar la imagen del disco al eliminar el producto
        if ($producto->imagen) {
            Storage::disk('public')->delete($producto->imagen);
        }

        $producto->delete();
        return response()->json(['message' => 'Producto eliminado']);
    }
}