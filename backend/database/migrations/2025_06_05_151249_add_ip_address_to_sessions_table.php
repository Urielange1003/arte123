<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   // Dans le nouveau fichier de migration (par ex. database/migrations/yyyy_yy_yy_yyyyyy_add_ip_address_to_sessions_table.php)
public function up()
{
    if (!Schema::hasTable('sessions')) {
        Schema::table('sessions', function (Blueprint $table) {
            $table->string('ip_address', 45)->nullable()->after('user_id'); // ou une autre position
            });
    }
}

public function down()
{
    Schema::table('sessions', function (Blueprint $table) {
        $table->dropColumn('ip_address');
    });
}
};
