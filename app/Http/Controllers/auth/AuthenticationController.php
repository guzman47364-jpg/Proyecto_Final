<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthenticationController extends Controller
{
    // El Trait debe ir siempre al principio de la clase
    use ApiResponse;

    /**
     * @operationId Register
     */
    public function register(Request $request)
    {
        try {
            $messages = [
                'name.required' => 'El nombre es obligatorio.',
                'email.required' => 'El correo es obligatorio.',
                'email.email' => 'El correo no es válido.',
                'email.unique' => 'Este correo ya está registrado.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
                'password.confirmed' => 'Las contraseñas no coinciden.',
            ];

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ], $messages);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->assignRole('Cliente');
            
            // Cargamos roles para que el frontend los reciba al registrarse
            $user->load('roles', 'permissions');

            $token = auth('api')->login($user);

            $data = [
                'status' => true,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name')
            ];

            return $this->success('Usuario registrado exitosamente como Cliente', 201, $data);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Error al registrar el usuario: ' . $th->getMessage()
            ], 500);
        }
    }

   
    public function login(Request $request)
    {
        try {
            $messages = [
                'email.required' => 'El correo es obligatorio.',
                'email.email' => 'El correo no es válido.',
                'email.exists' => 'El correo no está registrado.',
                'password.required' => 'La contraseña es obligatoria.',
                'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            ];

            $validator = Validator::make($request->all(), [
                'email' => 'required|email|exists:users,email',
                'password' => 'required|min:8',
            ], $messages);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $credentials = $request->only('email', 'password');

            if (!$token = auth('api')->attempt($credentials)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Credenciales inválidas'
                ], 401);
            }

            $user = auth('api')->user();
            
            // IMPORTANTE: Cargar relaciones antes de enviar al frontend
            $user->load('roles', 'permissions');

            $usuarios = [
                'status' => true,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name')
            ];

            return $this->success('Inicio de sesión exitoso', 200, $usuarios);

        } catch (\Throwable $th) {
            return $this->error('Error al iniciar sesión: ' . $th->getMessage());
        }
    }


    public function refresh()
    {
        try {
            if (!$token = auth('api')->refresh()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No se pudo refrescar el token'
                ], 401);
            }

            $user = auth('api')->user();
            $user->load('roles', 'permissions');

            $usuario = [
                'status' => true,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => auth('api')->factory()->getTTL() * 60,
                'user' => $user,
                'roles' => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name')
            ];
            return $this->success('Token refrescado exitosamente', 200, $usuario);
        } catch (\Throwable $th) {
            return $this->error('Error al refrescar el token');
        }
    }

    public function logout()
    {
        try {
            auth('api')->logout();
            return $this->success('Se cerró sesión correctamente', 200);
        } catch (\Throwable $th) {
            return $this->error('Error al cerrar sesión');
        }
    }

    public function validatedToken(Request $request)
    {
        try {
            $user = JWTAuth::setToken($request->token)->authenticate();

            if (!$user) {
                return $this->error('Token válido pero usuario no encontrado', 404);
            }

            $user->load('roles', 'permissions');

            return $this->success('Token válido', 200, [
                'user' => $user
            ]);

        } catch (JWTException $e) {
            return $this->error('Token inválido o expirado', 401);
        } catch (\Throwable $th) {
            return $this->error('Error inesperado', 500);
        }
    }
}