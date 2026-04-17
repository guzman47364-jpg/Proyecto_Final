<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\UsersCreateRequest;
use App\Models\Logs\Logs;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Helpers\CacheHelper;
use App\Http\Requests\RolesOrPermission\AsignarPermisosUsuarioRequest;
use App\Http\Requests\RolesOrPermission\AsignarRolUsuarioRequest;
use App\Http\Requests\RolesOrPermission\RevocarPermisoUsuarioRequest;
use App\Http\Requests\RolesOrPermission\RevocarRolUsuarioRequest;

class UserController extends Controller
{
    //
    use ApiResponse;
  
    public function index(Request $request)
    {
        try {
             // Usamos un cache key único para cada página/filtro
            $page = $request->get('page', 1);

            
           $cacheKey = "api_users_page_{$page}";

            $user = CacheHelper::remember($cacheKey,600,function(){
                return  User::with(['roles'])->paginate(10);
            });


            
            $pagination = [
                'lastPage'=>$user->lastPage(),
                'currentPage'=>$user->currentPage(),
                'perPage'=>$user->perPage(),
                'total'=>$user->total()
            ];

            $userData = $user->map(function($row){
                    return [
                        'id'    => $row->id,
                        'name'  => $row->name,
                        'email' => $row->email,
                        'roles' => $row->getRoleNames(), // <--- AGREGA ESTO
                    ];
                });
            return $this->success('Lista de usuarios',200,$userData, $pagination);
        } catch (\Exception $e) {
            //throw $th;
            return $this->error('Error al cargar los usuarios');
        }
       
    }

  
    public function createUser(UsersCreateRequest $request){
        DB::beginTransaction();
        try {
            $validated = $request->validated();

            $user = User::create([
                'name'=>$validated['name'],
                'email'=>$validated['email'],
                'password'=>Hash::make($validated['password'])
            ]);
            if($request->has('rol')){
                $user->assignRole($validated['rol']);
            }
            
            if($request->has('permisos')){
                foreach($validated['permisos'] as $permiso){
                    $user->givePermissionTo($permiso);
                }
            }

            Logs::create([
                'action' => 'create_user',
                'ip' => $request->ip(),
                'data' => $user->id
            ]);
            DB::commit();
            Cache::forget("api_users_page_1");
            return $this->success('Usuario creado',200,$user);
        } catch (\Exception $e) {
            //throw $th;
           DB::rollBack();
            return $e->getMessage();
        }
    }
public function update(Request $request, $id)
{
    try {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'rol' => 'required'
        ]);

        $user->name = $request->name;
        $user->email = $request->email;

        
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

       
        $user->syncRoles([$request->rol]);

        return response()->json(['message' => 'Usuario actualizado correctamente'], 200);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Error al actualizar: ' . $e->getMessage()], 500);
    }
}
public function destroy($id)
{
    try {
        $user = User::findOrFail($id);

        // Seguridad: Evitar que un Admin se borre a sí mismo
        if (auth()->id() == $id) {
            return response()->json([
                'status' => 403,
                'message' => 'No puedes eliminar tu propia cuenta'
            ], 403);
        }

        
        $user->roles()->detach();
        
        // Eliminar el usuario
        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Usuario eliminado correctamente'
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 500,
            'message' => 'Error al eliminar: ' . $e->getMessage()
        ], 500);
    }
}
 
   public function AgregarPermisoUsuario(AsignarPermisosUsuarioRequest $request, $userId){
    try {
        DB::beginTransaction();
        $validated = $request->validated();
        $user = User::find($userId);
        foreach($validated['permisos'] as $permiso){
            //validar si el permiso ya esta asignado al usuario
            if($user->hasPermissionTo($permiso)){
                continue;
            }

            $user->givePermissionTo($permiso);
        }
        DB::commit();
        return $this->success('Permisos asignados correctamente',200,$user);
    } catch (\Throwable $th) {
        //throw $th;
        DB::rollBack();
        return $this->error("Error al asignar permisos");
    }
   }
  
   public function RevocarPermisoUsuario(RevocarPermisoUsuarioRequest $request, $userId){
    try {
        DB::beginTransaction();
        $validated = $request->validated();
        $user = User::find($userId);
        foreach($validated['permisos'] as $permiso){
            $user->revokePermissionTo($permiso);
        }
        DB::commit();
        return $this->success('Permisos revocados correctamente',200,$user);
    } catch (\Throwable $th) {
        //throw $th;
        DB::rollBack();
        return $this->error("Error al revocar permisos");
    }
   }

  
   public function AsignarRolUsuario(AsignarRolUsuarioRequest $request, $userId){
    try {
        DB::beginTransaction();
        $validated = $request->validated();
        $user = User::find($userId);
        $user->assignRole($validated['rol']);
        DB::commit();
        return $this->success('Rol asignado correctamente',200,$user);
    }catch(\Throwable $th){
        DB::rollBack();
        return $this->error("Error al asignar rol");
    }
   }
   
  
   public function RevocarRolUsuario(RevocarRolUsuarioRequest $request, $userId){
    try {
        DB::beginTransaction();
        $validated = $request->validated();
        $user = User::find($userId);
        $user->removeRole($validated['rol']);
        DB::commit();
        return $this->success('Rol revocado correctamente',200,$user);
    }catch(\Throwable $th){
        DB::rollBack();
        return $this->error("Error al revocar rol");
    }
   }

}
