<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('proveedores', function (Blueprint $table) {
            // Agregamos la columna direccion
            $table->string('direccion')->nullable()->after('telefono');
        });
    }

    public function down()
    {
        Schema::table('proveedores', function (Blueprint $table) {
            $table->dropColumn('direccion');
        });
    }
};
