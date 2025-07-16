<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stagiaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'email',
        'formation',
        'telephone',
        'date_debut',
        'date_fin',
        'encadreur_id',
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
    ];

    /**
     * Relation avec l'encadreur
     */
    public function encadreur(): BelongsTo
    {
        return $this->belongsTo(Encadreur::class);
    }

    /**
     * Relation avec les lettres de stage
     */
    public function lettresStage(): HasMany
    {
        return $this->hasMany(LettreStage::class);
    }

    /**
     * Relation avec les rapports de stage
     */
    public function rapportsStage(): HasMany
    {
        return $this->hasMany(RapportStage::class);
    }
}
