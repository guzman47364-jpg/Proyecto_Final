<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
// IMPORTANTE: Tienes que agregar estas dos líneas de abajo
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
        // ESTA ES LA LÍNEA MÁGICA QUE FALTA:
        DetalleVenta::observe(DetalleVentaObserver::class);
    }
}