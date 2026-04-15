<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            
            // 1. EL DUEÑO DEL PRODUCTO (Vendedor)
            // Vincula el producto con un usuario. Si el usuario se borra, sus productos también (cascade).
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');

            $table->string('nombre');
            $table->text('descripcion')->nullable();
            $table->decimal('precio', 10, 2);
            
            // 2. STOCK
            // Es vital para una página de ventas saber cuánto hay disponible.
            $table->integer('stock')->default(0);

            // 3. RELACIONES EXISTENTES
            $table->foreignId('categoria_id')->constrained('categorias');
            $table->foreignId('marca_id')->constrained('marcas');
            $table->foreignId('proveedor_id')->constrained('proveedores');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void { 
        Schema::dropIfExists('productos'); 
    }
};