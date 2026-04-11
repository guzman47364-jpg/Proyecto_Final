<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Importación de Controladores de Autenticación
use App\Http\Controllers\auth\AuthenticationController;
use App\Http\Controllers\auth\RolPermissionController;
use App\Http\Controllers\auth\UserController;

// Importación de Controladores de Inventario (¡Asegúrate que estos archivos existan!)
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ProductoController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rutas Públicas de Autenticación
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthenticationController::class, 'login']);
    Route::post('/validate-token', [AuthenticationController::class, 'validatedToken']);
});

// Rutas de Inventario (Fuera del middleware para que React las lea sin token por ahora)
Route::apiResource('marcas', MarcaController::class);
Route::apiResource('categorias', CategoriaController::class);
Route::apiResource('proveedores', ProveedorController::class);
Route::apiResource('productos', ProductoController::class); // <--- Agregada la ruta 404 corregida

// Rutas Protegidas (Requieren Token)
Route::middleware('auth:api')->group(function () {

    // Auth avanzado
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthenticationController::class, 'logout'])->middleware('rolePermission:Super Admin,Admin');
        Route::post('/refresh', [AuthenticationController::class, 'refresh'])->middleware('rolePermission:Super Admin,Admin');
    });

    // Gestión de Usuarios
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->middleware('rolePermission:Super Admin');
        Route::post('/', [UserController::class, 'createUser'])->middleware('rolePermission:Super Admin');
        Route::post('/agregar-permisos/{userId}', [UserController::class, 'AgregarPermisoUsuario'])->middleware('rolePermission:Super Admin');
        Route::post('/asignar-rol/{userId}', [UserController::class, 'AsignarRolUsuario'])->middleware('rolePermission:Super Admin');
        Route::post('/revocar-rol/{userId}', [UserController::class, 'RevocarRolUsuario'])->middleware('rolePermission:Super Admin');
        Route::post('/revocar-permisos/{userId}', [UserController::class, 'RevocarPermisoUsuario'])->middleware('rolePermission:Super Admin');
    });

    // Roles y Permisos
    Route::prefix('rol-permisos')->group(function () {
        Route::get('/lista-permisos', [RolPermissionController::class, 'ListPermission'])->middleware('rolePermission:Super Admin');
        Route::get('/lista-roles', [RolPermissionController::class, 'ListRole'])->middleware('rolePermission:Super Admin');
        Route::post('create-permission', [RolPermissionController::class, 'createPermission'])->middleware('rolePermission:Super Admin');
        Route::post('/create-rol', [RolPermissionController::class, 'createRol'])->middleware('rolePermission:Super Admin');
        Route::delete('/eliminar-rol/{id}', [RolPermissionController::class, 'eliminarRol'])->middleware('rolePermission:Super Admin');
        Route::delete('/eliminar-permiso', [RolPermissionController::class, 'eliminarPermisos'])->middleware('rolePermission:Super Admin');
    });
});