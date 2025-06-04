<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'stage_id',
        'file_path',
        'validated_by',
    ];

    public function stage()
    {
        return $this->belongsTo(Stage::class);
    }

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }
}