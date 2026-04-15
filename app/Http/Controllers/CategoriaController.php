<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::all(), 200);
    }

    public function store(Request $request)
{
    // 1. Verificamos si es Admin (Seguridad extra)
    if (!auth()->user()->hasRole('Admin')) {
        return response()->json(['message' => 'No tienes permiso para crear categorías'], 403);
    }

    $request->validate(['nombre' => 'required|string|unique:categorias,nombre|max:255']);
    
    $categoria = Categoria::create($request->all());
    return response()->json($categoria, 201);
}

    public function show(Categoria $categoria)
    {
        return response()->json($categoria, 200);
    }

    public function update(Request $request, Categoria $categoria)
    {
        $request->validate(['nombre' => 'string|max:255']);
        $categoria->update($request->all());
        return response()->json($categoria, 200);
    }

    public function destroy(Categoria $categoria)
    {
        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada con éxito'], 200);
    }
}
