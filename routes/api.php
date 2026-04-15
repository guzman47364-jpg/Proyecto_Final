<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controladores de Autenticación
use App\Http\Controllers\Auth\AuthenticationController;
use App\Http\Controllers\Auth\RolPermissionController;
use App\Http\Controllers\Auth\UserController;

// Controladores de Negocio
use App\Http\Controllers\MarcaController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\DetalleVentaController;

/*
|--------------------------------------------------------------------------
| API Routes - Sistema de Ventas & E-commerce
|--------------------------------------------------------------------------
*/

// --- 1. RUTAS PÚBLICAS ---
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthenticationController::class, 'login']);
    Route::post('/register', [AuthenticationController::class, 'register']);
    Route::post('/validate-token', [AuthenticationController::class, 'validatedToken']);
});

// Catálogo abierto para visitantes
Route::get('productos', [ProductoController::class, 'index']);
Route::get('productos/{id}', [ProductoController::class, 'show']);
Route::get('categorias', [CategoriaController::class, 'index']);
Route::get('marcas', [MarcaController::class, 'index']);


// --- 2. RUTAS PROTEGIDAS (Requieren JWT Token) ---
Route::middleware('auth:api')->group(function () {

    // Auth & Sesión
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthenticationController::class, 'logout']);
        Route::post('/refresh', [AuthenticationController::class, 'refresh']);
    });

    // --- MÓDULO DE VENTAS ---
    Route::post('ventas', [VentaController::class, 'store']); // Realizar compra
    Route::get('ventas/{id}/detalles', [DetalleVentaController::class, 'showByVenta']);
    
    // Historial (Solo Admin y Vendedor)
    Route::get('ventas', [VentaController::class, 'index'])
        ->middleware('rolePermission:Admin,Vendedor');


    // --- GESTIÓN DE INVENTARIO (CRUD COMPLETO) ---
    
    // Productos
    Route::prefix('productos')->middleware('rolePermission:Admin,Vendedor')->group(function () {
        Route::post('/', [ProductoController::class, 'store']);
        Route::put('/{id}', [ProductoController::class, 'update']);
        Route::delete('/{id}', [ProductoController::class, 'destroy']);
    });

    // Categorías
    Route::prefix('categorias')->middleware('rolePermission:Admin')->group(function () {
        Route::post('/', [CategoriaController::class, 'store']);
        Route::put('/{id}', [CategoriaController::class, 'update']);
        Route::delete('/{id}', [CategoriaController::class, 'destroy']);
    });

    // Marcas
    Route::prefix('marcas')->middleware('rolePermission:Admin')->group(function () {
        Route::post('/', [MarcaController::class, 'store']);
        Route::put('/{id}', [MarcaController::class, 'update']);
        Route::delete('/{id}', [MarcaController::class, 'destroy']);
    });

    // Proveedores (apiResource ya incluye index, store, show, update, destroy)
    Route::apiResource('proveedores', ProveedorController::class)
        ->middleware('rolePermission:Admin');


    // --- GESTIÓN DE USUARIOS Y SEGURIDAD (Solo Admin) ---
    Route::prefix('admin')->middleware('rolePermission:Admin')->group(function () {
        // CRUD de Usuarios
        Route::get('usuarios', [UserController::class, 'index']);      
        Route::post('usuarios', [UserController::class, 'createUser']); 
        Route::put('usuarios/{id}', [UserController::class, 'update']);    // Editar usuario
        Route::delete('usuarios/{id}', [UserController::class, 'destroy']); // Eliminar usuario
        
        // Roles específicos
        Route::post('asignar-rol/{userId}', [UserController::class, 'AsignarRolUsuario']);
        Route::post('revocar-rol/{userId}', [UserController::class, 'RevocarRolUsuario']);
    });

    // Configuración de Roles y Permisos del Sistema
    Route::prefix('rol-permisos')->middleware('rolePermission:Admin')->group(function () {
        Route::get('/lista-permisos', [RolPermissionController::class, 'ListPermission']);
        Route::get('/lista-roles', [RolPermissionController::class, 'ListRole']);
        Route::post('/create-rol', [RolPermissionController::class, 'createRol']);
        Route::delete('/eliminar-rol/{id}', [RolPermissionController::class, 'eliminarRol']);
    });

});