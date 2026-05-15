<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Database\Eloquent\SoftDeletes;


class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasRoles;
    use SoftDeletes; 
   
    protected $with = ['roles']; 

    protected $fillable = [
        'name',
        'email',
        'password',
        'direccion',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- JWT METHODS ---

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [
           
            'roles' => $this->getRoleNames(), 
            'permissions' => $this->getPermissionNames(),
            'user' => $this->name,
            'email' => $this->email,
            'id' => $this->id,
        ];
    }
}