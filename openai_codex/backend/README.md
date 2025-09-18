# Backend (Laravel)

Laravel application for the EC record marketplace. The directory tree matches a default Laravel install so you can drop the real source in later.

## Getting started

1. Ensure PHP 8.2+, Composer, and a database server (MySQL or PostgreSQL) are available locally.
2. Replace the placeholder `.gitkeep` files by generating a fresh Laravel app:
   ```bash
   cd backend
   rm $(find . -name '.gitkeep')
   composer create-project laravel/laravel .
   ```
3. Configure `.env` with your database connection and app key.
4. Run migrations and start the development server:
   ```bash
   php artisan migrate
   php artisan serve
   ```

Add additional packages (Sanctum, Passport, etc.) as needed for authentication and API support.
