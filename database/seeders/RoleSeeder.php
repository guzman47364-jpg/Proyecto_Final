<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Definir los Guards
        $guards = ['web', 'api'];

        // 2. Definir los Permisos de la Tienda
        $permissions = [
            // Gestión de Productos
            'ver_productos', 
            'crear_productos', 
            'editar_productos', 
            'eliminar_productos',
            
            // Gestión de Ventas/Carrito
            'realizar_compra', 
            'gestionar_ventas', // Para que el vendedor vea sus pedidos recibidos
            'ver_reportes_globales', // Solo Admin
            
            // Gestión de Usuarios
            'crear_usuario', 
            'editar_usuario', 
            'eliminar_usuario', 
            'ver_usuarios',
        ];

        // Crear permisos para cada guard
        foreach ($guards as $guard) {
            foreach ($permissions as $permission) {
                Permission::firstOrCreate([
                    'name' => $permission,
                    'guard_name' => $guard
                ]);
            }
        }

        // 3. Crear Roles y Asignar Permisos
        foreach ($guards as $guard) {
            
            // --- ROL: ADMIN (Poder total) ---
            $adminRole = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => $guard]);
            $adminRole->syncPermissions(Permission::where('guard_name', $guard)->get());

            // --- ROL: VENDEDOR (Gestión de su inventario y ventas) ---
            $vendedorRole = Role::firstOrCreate(['name' => 'Vendedor', 'guard_name' => $guard]);
            $vendedorRole->syncPermissions([
                'ver_productos',
                'crear_productos',
                'editar_productos',
                'eliminar_productos',
                'gestionar_ventas',
                'ver_usuarios', // Para ver quién le compra
            ]);

            // --- ROL: COMPRADOR (Cliente final) ---
            $compradorRole = Role::firstOrCreate(['name' => 'Comprador', 'guard_name' => $guard]);
            $compradorRole->syncPermissions([
                'ver_productos',
                'realizar_compra',
            ]);
        }
    }
}