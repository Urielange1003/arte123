<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
            if (!Schema::hasTable('applications')) {
                Schema::create('applications', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->string('internship_type');
                $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
                $table->text('rejection_reason')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('applications')) {
            Schema::dropIfExists('applications');
        }
    }
};