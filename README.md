
# Student Management (Laravel API + Vue.js)

Laravel RESTful API with Sanctum authentication and role-based access,
plus a Vue.js 3 frontend, in one project.

## Setup

    composer install
    npm install
    copy .env.example .env
    php artisan key:generate

Before running the seeder, open your `.env` file and add your own passwords:

    SEED_ADMIN_PASSWORD=your-own-admin-password
    SEED_USER_PASSWORD=your-own-user-password

Then run:

    php artisan migrate --seed
    npm run dev
    php artisan serve

Open http://127.0.0.1:8000

## Login accounts

The seeder creates two demo accounts:

| Role | Email |
|---|---|
| Administrator | admin@email.com |
| Regular User | user@email.com |

Passwords are not stored in this repository.

Set your passwords in your own `.env` file before running the seeder.

If the password variables are left empty, random passwords are generated and printed in the terminal.

Administrators can add, edit and delete students. Regular users can only view them.
