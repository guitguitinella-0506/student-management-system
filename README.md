# Student Management (Laravel API + Vue.js)

Laravel RESTful API with Sanctum authentication and role-based access,
plus a Vue.js 3 frontend, in one project.

## Setup

    composer install
    npm install
    copy .env.example .env
    php artisan key:generate
    php artisan migrate --seed
    npm run dev
    php artisan serve

Open http://127.0.0.1:8000

## Login accounts

| Role | Email | Password |
|---|---|---|
| Administrator | admin@email.com | password123 |
| Regular User | user@email.com | password123 |

Administrators can add, edit and delete students. Regular users can only view them.