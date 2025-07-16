<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public const ROLE_ADMIN = 'admin';
    public const ROLE_RH = 'rh';
    public const ROLE_ENCADREUR = 'encadreur';
    public const ROLE_STAGIAIRE = 'stagiaire';

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isRH(): bool
    {
        return $this->role === self::ROLE_RH;
    }

    public function isEncadreur(): bool
    {
        return $this->role === self::ROLE_ENCADREUR;
    }

    public function isStagiaire(): bool
    {
        return $this->role === self::ROLE_STAGIAIRE;
    }

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function supervisedStages()
    {
        return $this->hasMany(Stage::class, 'supervisor_id');
    }

    public function stage()
    {
        return $this->hasOne(Stage::class);
    }

    public function badge()
    {
        return $this->hasOne(Badge::class);
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
}