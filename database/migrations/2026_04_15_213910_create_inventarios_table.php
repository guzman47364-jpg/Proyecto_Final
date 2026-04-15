<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up(): void
{
    Schema::create('inventarios', function (Blueprint $table) {
        $table->id();
        
        // Relación con el producto
        $table->foreignId('producto_id')
              ->constrained('productos')
              ->onDelete('cascade');

        // Relación con el usuario (quién hizo el ajuste, venta o compra)
        $table->foreignId('user_id')
              ->constrained('users');

        // Datos del movimiento
        $table->integer('cantidad'); // Ejemplo: 5, 10, 100
        $table->enum('tipo', ['entrada', 'salida', 'ajuste']); // Tipo de movimiento
        $table->string('descripcion')->nullable(); // Ej: "Compra a proveedor", "Venta #12", "Dañado"
        
        $table->timestamps(); // Esto nos da la fecha exacta del movimiento
    });
}

public function down(): void
{
    Schema::dropIfExists('inventarios');
}
};
