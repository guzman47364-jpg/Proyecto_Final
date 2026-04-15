<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventarios';

    protected $fillable = [
        'producto_id',
        'user_id',
        'cantidad',
        'tipo',
        'descripcion'
    ];

    // Relación inversa: Un registro de inventario pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    // Relación inversa: Un registro de inventario pertenece a un usuario
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}