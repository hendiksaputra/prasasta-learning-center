<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@prasasta.com'],
            [
                'name' => 'Admin PRASASTA',
                'email' => 'admin@prasasta.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
            ]
        );

        $this->command->info('Admin user created!');
        $this->command->info('Email: admin@prasasta.com');
        $this->command->info('Password: admin123');
    }
}

