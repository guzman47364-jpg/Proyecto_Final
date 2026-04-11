<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Proveedor extends Model
{
    use HasFactory;

    protected $table = 'proveedors'; // Laravel por defecto pluraliza así, confirma en tu migrate
    protected $fillable = ['nombre', 'contacto']; 
}