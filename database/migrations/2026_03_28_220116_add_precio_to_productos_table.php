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
    Schema::table('productos', function (Blueprint $table) {
        // Creamos la columna precio con soporte para decimales (ej: 10.50)
        $table->decimal('precio', 10, 2)->default(0)->after('nombre');
    });
}
};
