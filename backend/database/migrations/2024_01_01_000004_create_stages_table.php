<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('stages')) {  
             Schema::create('stages', function (Blueprint $table) {
                $table->id();
                 $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('supervisor_id')->constrained('users');
                $table->date('start_date');
                $table->date('end_date');
                $table->enum('status', ['ongoing', 'completed'])->default('ongoing');
                $table->timestamps();
                });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('stages')) {
              Schema::dropIfExists('stages');
        }
    }
};