<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    protected $table = 'ventas'; 

    protected $fillable = [
        'user_id', 
        'total', 
        'estado', 
        'metodo_pago'
    ];

    // Relación: Una venta tiene muchos detalles
    public function detalles() {
        return $this->hasMany(DetalleVenta::class, 'venta_id');
    }

    // Relación: Una venta pertenece a un usuario (cliente o admin)
    public function cliente() {
        return $this->belongsTo(User::class, 'user_id');
    }
}