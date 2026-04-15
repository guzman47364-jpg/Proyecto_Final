<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',      // El vendedor
    'nombre', 
    'descripcion',
    'precio', 
    'stock',        // El inventario
    'marca_id', 
    'categoria_id',
    'proveedor_id'
];
    // Relación con el Vendedor (Usuario)
    public function vendedor() {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Relaciones existentes
    public function marca() {
        return $this->belongsTo(Marca::class);
    }

    public function categoria() {
        return $this->belongsTo(Categoria::class);
    }

    public function proveedor() {
        return $this->belongsTo(Proveedor::class);
    }
}