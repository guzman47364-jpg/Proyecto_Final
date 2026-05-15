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
        'nombre'    => 'required|string|max:255',
        'telefono'  => 'nullable|string|max:20',
        'direccion' => 'nullable|string', // <--- AGREGA ESTO
        'estado'    => 'boolean' 
    ]);

    $proveedor = Proveedor::create($request->all());

    return response()->json($proveedor, 201);
}
public function show($id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return response()->json(['message' => 'Proveedor no encontrado'], 404);
        }
        return response()->json($proveedor, 200);
    }

  public function update(Request $request, $id)
{
    $proveedor = Proveedor::find($id);
    if (!$proveedor) {
        return response()->json(['message' => 'Proveedor no encontrado'], 404);
    }

    // Opcional: También valida en el update
    $request->validate([
        'nombre'    => 'string|max:255',
        'telefono'  => 'nullable|string|max:20',
        'direccion' => 'nullable|string',
        'estado'    => 'boolean'
    ]);

    $proveedor->update($request->all());
    return response()->json($proveedor, 200);
}
    public function destroy($id)
    {
        $proveedor = Proveedor::find($id);
        if (!$proveedor) {
            return response()->json(['message' => 'Proveedor no encontrado'], 404);
        }

        $proveedor->delete();
        return response()->json(['message' => 'Proveedor eliminado con éxito'], 200);
    }
}