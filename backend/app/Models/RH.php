<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RH extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'role',
    ];

    /**
     * Relation avec les lettres de stage validées
     */
    public function lettresStage(): HasMany
    {
        return $this->hasMany(LettreStage::class);
    }
}
