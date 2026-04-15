<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// IMPORTANTE: Agregamos estas líneas para que Laravel encuentre las clases
use App\Models\DetalleVenta;
use App\Observers\DetalleVentaObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Aquí registramos el "vigilante"
        DetalleVenta::observe(DetalleVentaObserver::class);
    }
}