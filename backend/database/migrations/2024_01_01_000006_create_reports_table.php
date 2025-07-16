<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('reports')) {  
            Schema::create('reports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('stage_id')->constrained()->onDelete('cascade');
                $table->string('file_path');
                $table->foreignId('validated_by')->nullable()->constrained('users');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('reports')) {
            Schema::dropIfExists('reports');
        }
    }
};