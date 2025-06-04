<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage_id',
        'date',
        'is_present',
    ];

    protected $casts = [
        'date' => 'date',
        'is_present' => 'boolean',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }
}