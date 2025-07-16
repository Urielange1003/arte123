<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidature extends Model
{
    use HasFactory;

    protected $fillable = [
        'stagiaire_id',
        'stage_id',
        'date_candidature',
        'statut',
        'date_statut_change',
        'commentaires_rh',
        'commentaires_encadreur',
        'cv_document_id',
        'certif_scolarite_document_id',
        'lettre_stage_document_id',
    ];

    protected $casts = [
        'date_candidature' => 'datetime',
        'date_statut_change' => 'datetime',
    ];

    // Relation avec le stagiaire
    public function stagiaire()
    {
        return $this->belongsTo(Stagiaire::class);
    }

    // Relation avec le stage
    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    // Relations avec les documents (CV, Certificat, Lettre de stage)
    public function cvDocument()
    {
        return $this->belongsTo(Document::class, 'cv_document_id');
    }

    public function certifScolariteDocument()
    {
        return $this->belongsTo(Document::class, 'certif_scolarite_document_id');
    }

    public function lettreStageDocument()
    {
        return $this->belongsTo(Document::class, 'lettre_stage_document_id');
    }
}