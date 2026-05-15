<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleVenta extends Model
{
    protected $table = 'detalle_ventas'; 

    protected $fillable = [
        'venta_id', 
        'producto_id', 
        'cantidad', 
        'precio_unitario', 
        'subtotal'
    ];

    // Relación: Un detalle pertenece a una venta
    public function venta() {
        return $this->belongsTo(Venta::class, 'venta_id');
    }

    // Relación: Un detalle pertenece a un producto
    public function producto() {
        return $this->belongsTo(Producto::class, 'producto_id');
    }

    protected static function booted()
{
    static::observe(\App\Observers\DetalleVentaObserver::class);
}
}