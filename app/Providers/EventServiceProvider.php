<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\DetalleVenta;
use App\Observers\DetalleVentaObserver;

class AppServiceProvider extends ServiceProvider
{
  
    public function register(): void
    {
        //
    }


    public function boot(): void
    {
        
        DetalleVenta::observe(DetalleVentaObserver::class);
    }
}