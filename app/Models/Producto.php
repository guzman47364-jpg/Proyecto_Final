<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    use HasFactory;

    // REVISA QUE ESTÉN ESTOS 5 CAMPOS AQUÍ:
    protected $fillable = [
        'nombre', 
        'precio', 
        'stock', 
        'marca_id', 
        'categoria_id',
        'proveedor_id'
    ];

    // Relaciones
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