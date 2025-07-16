<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('profiles')) {
            Schema::create('profiles', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->date('date_of_birth')->nullable();
                $table->string('address')->nullable();
                $table->string('phone')->nullable();
                $table->string('education_level')->nullable();
                $table->string('formation_type')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
            if (Schema::hasTable('profiles')) {
                Schema::dropIfExists('profiles');
        }
    }
};