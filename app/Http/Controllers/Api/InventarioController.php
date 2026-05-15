<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventario;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    public function index()
    {
        // Traemos el historial, cargando el nombre del producto y el usuario
        $movimientos = Inventario::with(['producto', 'user'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($movimientos);
    }
}