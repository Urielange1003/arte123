<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'internship_type',
        'status',
        'rejection_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }

    public function interview()
    {
        return $this->hasOne(Interview::class);
    }

    public function stage()
    {
        return $this->hasOne(Stage::class);
    }
}