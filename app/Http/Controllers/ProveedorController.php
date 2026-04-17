<?php

namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    public function index()
    {
        return response()->json(Proveedor::all(), 200);
    }

    public function store(Request $request)
{
    $request->validate([
        'nombre'   => 'required|string|max:255',
        'telefono' => 'nullable|string|max:20',
        'estado'   => 'boolean' 
    ]);

   
    $proveedor = Proveedor::create($request->all());

    return response()->json($proveedor, 201);
}

    public function show(Proveedor $proveedor)
    {
        return response()->json($proveedor, 200);
    }

    public function update(Request $request, Proveedor $proveedor)
    {
        $proveedor->update($request->all());
        return response()->json($proveedor, 200);
    }

    public function destroy(Proveedor $proveedor)
    {
        $proveedor->delete();
        return response()->json(['message' => 'Proveedor eliminado con éxito'], 200);
    }
}