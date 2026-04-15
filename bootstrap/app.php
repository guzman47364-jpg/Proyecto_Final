<?php

use App\Http\Middleware\RoleOrPermissionMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

// bootstrap/app.php
return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // 1. REGISTRAMOS EL ALIAS (Esto es lo que te falta)
        $middleware->alias([
            'rolePermission' => \App\Http\Middleware\RoleOrPermissionMiddleware::class,
        ]);

        // 2. Habilitar CORS / Excepciones CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();