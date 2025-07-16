<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('presences')) {  
            Schema::create('presences', function (Blueprint $table) {
                $table->id();
                $table->foreignId('stage_id')->constrained()->onDelete('cascade');
                $table->date('date');
                $table->boolean('is_present')->default(true);
                $table->timestamps();
            });
        }   
    }

    public function down(): void
    {
        if (Schema::hasTable('presences')) {
            Schema::dropIfExists('presences');
        }
    }
};