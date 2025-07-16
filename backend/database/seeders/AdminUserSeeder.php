<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // Création des tables si elles n'existent pas
        if (!\Schema::hasTable('roles')) {
            $this->command->error('La table roles n\'existe pas!');
            $this->command->info('Exécutez: php artisan migrate');
            return;
        }

        // Création du rôle admin
        $role = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web'
        ]);

        // Création de l'utilisateur admin (demandé par l'utilisateur)
        $user = User::firstOrCreate(
            ['email' => 'mouahaan6@gmail.com'], // email demandé
            [
                'name' => 'Administrateur',
                'password' => Hash::make('angeline1003'),
                'role' => 'admin', // renseigne la colonne role pour cohérence avec AuthController
            ]
        );

        // Assignation du rôle
        if (!$user->hasRole('admin')) {
            $user->assignRole($role);
            $this->command->info('Compte administrateur créé avec succès!');
        } else {
            $this->command->info('Le compte administrateur existe déjà.');
        }
    }
}