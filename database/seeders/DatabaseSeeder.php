<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {

        $adminPassword = env('SEED_ADMIN_PASSWORD') ?: Str::random(16);
        $userPassword = env('SEED_USER_PASSWORD') ?: Str::random(16);

        User::updateOrCreate(
            ['email' => 'admin@email.com'],
            [
                'name'     => 'Admin',
                'password' => Hash::make($adminPassword),
                'role'     => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'user@email.com'],
            [
                'name'     => 'Regular User',
                'password' => Hash::make($userPassword),
                'role'     => 'user',
            ]
        );

        if (!env('SEED_ADMIN_PASSWORD')) {
            $this->command->info("Generated admin password: {$adminPassword}");
        }
        if (!env('SEED_USER_PASSWORD')) {
            $this->command->info("Generated user password: {$userPassword}");
        }
    }
}