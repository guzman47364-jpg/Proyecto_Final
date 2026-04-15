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
        Schema::create('ventas', function (Blueprint $table) {
            $table->id();

            // Relación con el usuario que realiza la compra (Comprador)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Información financiera de la venta
            $table->decimal('total', 10, 2);
            $table->decimal('impuesto', 10, 2)->default(0.00);
            
            // Estado de la venta: útil para el flujo de trabajo
            // (pendiente, pagado, enviado, completado, cancelado)
            $table->string('estado')->default('pendiente');

            // Información adicional para el seguimiento
            $table->string('metodo_pago')->nullable(); // Ej: 'tarjeta', 'transferencia', 'bitcóin'
            $table->text('notas')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ventas');
    }
};