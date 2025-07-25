<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('documents')) {
              Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->foreignId('application_id')->constrained()->onDelete('cascade');
                $table->enum('document_type', ['cv', 'motivation_letter', 'school_certificate']);
                $table->string('file_path');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('documents')) {
            Schema::dropIfExists('documents');
        }
    }
};