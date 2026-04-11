<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
public function up(): void
    {
        Schema::create('marcas', function (Blueprint $table) {
            $table->id();
            $table->string('nombre'); // NOT NULL por defecto
            $table->boolean('estado')->default(true); // DEFAULT 1 (Activo)
            $table->timestamps(); // Crea created_at y updated_at
        });
    }
};


