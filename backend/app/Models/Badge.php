<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'badge_number',
        'issue_date',
        'return_date',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'return_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}