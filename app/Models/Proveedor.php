<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedores'; // El plural correcto en español

    // Solo los campos que existen en tu tabla
    protected $fillable = [
        'nombre', 
        'telefono', 
        'estado'
    ]; 
}