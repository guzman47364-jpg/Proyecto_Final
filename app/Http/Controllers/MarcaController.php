<?php

namespace App\Http\Controllers;

use App\Models\Marca;
use Illuminate\Http\Request;

class MarcaController extends Controller
{
    public function index()
    {
        return response()->json(Marca::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate(['nombre' => 'required|string|max:255']);
        $marca = Marca::create($request->all());
        return response()->json($marca, 201);
    }

    public function show(Marca $marca)
    {
        return response()->json($marca, 200);
    }

    public function update(Request $request, Marca $marca)
    {
        $request->validate(['nombre' => 'string|max:255']);
        $marca->update($request->all());
        return response()->json($marca, 200);
    }

    public function destroy(Marca $marca)
    {
        $marca->delete();
        return response()->json(['message' => 'Marca eliminada con éxito'], 200);
    }
}