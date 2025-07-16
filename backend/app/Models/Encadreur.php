<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Encadreur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'specialite',
    ];

    /**
     * Relation avec les stagiaires
     */
    public function stagiaires(): HasMany
    {
        return $this->hasMany(Stagiaire::class);
    }
}
