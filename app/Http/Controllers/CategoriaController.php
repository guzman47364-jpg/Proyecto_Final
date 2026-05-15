<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Importante para manejar archivos

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::all(), 200);
    }

    public function store(Request $request)
    {
        if (!auth()->user()->hasRole('Admin')) {
            return response()->json(['message' => 'No tienes permiso para crear categorías'], 403);
        }

        $request->validate([
            'nombre' => 'required|string|unique:categorias,nombre|max:255',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png|max:2048' // Validación de imagen
        ]);

        $data = $request->all();

        // Procesar la imagen si viene en la petición
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('categorias', 'public');
            $data['imagen'] = $path;
        }

        $categoria = Categoria::create($data);
        return response()->json($categoria, 201);
    }

    public function show($id)
    {
        $categoria = Categoria::find($id);
        
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }
        
        return response()->json($categoria, 200);
    }

    public function update(Request $request, $id)
    {
        $categoria = Categoria::find($id);
        
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        // Si vienes de React con FormData, Laravel procesará el archivo aquí
        $request->validate([
            'nombre' => 'string|max:255',
            'imagen' => 'nullable|image|mimes:jpg,jpeg,png|max:2048'
        ]);

        $data = $request->all();

        if ($request->hasFile('imagen')) {
            // Borramos la imagen vieja si existe para no acumular basura en el servidor
            if ($categoria->imagen) {
                Storage::disk('public')->delete($categoria->imagen);
            }
            
            // Guardamos la nueva
            $path = $request->file('imagen')->store('categorias', 'public');
            $data['imagen'] = $path;
        }

        $categoria->update($data);
        
        return response()->json($categoria, 200);
    }

    public function destroy($id)
    {
        $categoria = Categoria::find($id);
        
        if (!$categoria) {
            return response()->json(['message' => 'Categoría no encontrada'], 404);
        }

        // Borrar la imagen del storage antes de eliminar el registro de la DB
        if ($categoria->imagen) {
            Storage::disk('public')->delete($categoria->imagen);
        }

        $categoria->delete();
        
        return response()->json(['message' => 'Categoría eliminada con éxito'], 200);
    }
}