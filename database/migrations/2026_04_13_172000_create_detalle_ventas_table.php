<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('detalle_ventas', function (Blueprint $table) {
            $table->id();
            
            // Relación con la cabecera de la venta
            $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
            
            // Relación con el producto vendido
            $table->foreignId('producto_id')->constrained('productos');
            
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2); // Precio al momento de la compra
            $table->decimal('subtotal', 10, 2);        // cantidad * precio_unitario
            
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('detalle_ventas');
    }
};