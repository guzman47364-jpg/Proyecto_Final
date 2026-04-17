<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RolesOrPermission\AsignarPermisosUsuarioRequest;
use App\Http\Requests\RolesOrPermission\CreatePermissionRequest;
use App\Http\Requests\RolesOrPermission\CreateRolRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolPermissionController extends Controller
{
    use ApiResponse;

   
    public function ListRole(){
        try {
            $roles = Role::all();
            return $this->success('Roles',200,$roles);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->error("Error al listar los roles");
        }
    }

    public function ListPermission(){
        try {
            $permissions = Permission::all();
            return $this->success('Permisos',200,$permissions);
        } catch (\Throwable $th) {
            //throw $th;
            return $this->error("Error al listar los permisos");
        }
    }

    
    public function createPermission(CreatePermissionRequest $request){
        try {
            //code...
            $validated = $request->validated();

            DB::beginTransaction();
            $createdPermissions = [];
            
            foreach ($validated['name'] as $permission) {
                // Check if permission already exists
                if (!Permission::where('name', $permission)->exists()) {
                    $newPermission = Permission::create(['name' => $permission]);
                    $createdPermissions[] = $newPermission;
                }
            }
            
            DB::commit();

            if (empty($createdPermissions)) {
                return $this->error('Error al crear los permisos.', 401);
            }
            

            return $this->success('Permiso creado',200,$validated);

        } catch (\Exception $e) {
            //throw $th;
            return $this->error('Error al crear el permiso ');
        }
    }

   
    public function createRol(CreateRolRequest $request){
        try {
            //code...
            $validated = $request->validated();
            DB::beginTransaction();
               $rol = Role::create([
                    'name'=>$validated['name']
                ]);
                //asignar permisos a rol
                $rol->syncPermissions($validated['permissions']);
            DB::commit();
          
            return $this->success('Rol creado',200,$validated);
        } catch (\Exception $e) {
            //throw $th;
            return $this->error('Error al crear el rol ');
        }
    }
   
    public function eliminarRol($id){
        try {
            
            $rol = Role::find($id);
            if(!$rol){
                return $this->error('Rol no encontrado',404);
            }
            //eliminar permisos del rol
            $rol->syncPermissions([]);
            //eliminar rol
            $rol->delete();
            return $this->success('Rol eliminado',200);
        } catch (\Exception $e) {
           
            return $this->error('Error al eliminar el rol ');
        }
    }


    public function eliminarPermisos(AsignarPermisosUsuarioRequest $request){
        try {
            //code...
            $validated = $request->validated();
            $permisos = $validated['permisos'];
            foreach($permisos as $permiso){
                $permiso = Permission::find($permiso);
                if(!$permiso){
                    return $this->error('Permiso no encontrado',404);
                }
                $permiso->delete();
            }
            return $this->success('Permisos eliminados',200);
        } catch (\Exception $e) {
            //throw $th;
            return $this->error('Error al eliminar el permiso ');
        }
    }
}
