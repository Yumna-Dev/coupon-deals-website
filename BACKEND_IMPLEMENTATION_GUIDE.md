# Coupon Deals Backend Implementation Guide

## Overview
This guide provides a comprehensive step-by-step approach to implementing the backend for the Coupon Deals platform using Laravel and MySQL. The backend supports the React Vite frontend with features for browsing, searching, filtering, and saving coupons.

## Technology Stack
- **Framework:** Laravel 11
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **Caching:** Redis (optional, for performance)
- **Queue System:** Laravel Queue (for async tasks)
- **API Documentation:** OpenAPI/Swagger

---

## Phase 1: Project Setup

### 1.1 Initialize Laravel Project
\`\`\`bash
composer create-project laravel/laravel coupon-deals
cd coupon-deals
\`\`\`

### 1.2 Environment Configuration
Create `.env` file with:
\`\`\`
APP_NAME="Coupon Deals"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coupon_deals
DB_USERNAME=root
DB_PASSWORD=

JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_TTL=60

CACHE_DRIVER=redis
QUEUE_CONNECTION=sync
\`\`\`

### 1.3 Install Required Packages
\`\`\`bash
composer require tymon/jwt-auth
composer require laravel/sanctum
composer require predis/predis
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\JWTAuthServiceProvider"
php artisan jwt:secret
\`\`\`

---

## Phase 2: Database Design

### 2.1 Create Database
\`\`\`sql
CREATE DATABASE coupon_deals CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
\`\`\`

### 2.2 Database Schema

#### Users Table
\`\`\`sql
CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  email_verified_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);
\`\`\`

#### Categories Table
\`\`\`sql
CREATE TABLE categories (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug)
);
\`\`\`

#### Coupons Table
\`\`\`sql
CREATE TABLE coupons (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  store VARCHAR(255) NOT NULL,
  discount INT NOT NULL CHECK (discount > 0 AND discount <= 100),
  code VARCHAR(50) UNIQUE NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  expiry_date DATETIME NOT NULL,
  usage_count INT DEFAULT 0,
  max_usage INT,
  is_active BOOLEAN DEFAULT true,
  created_by BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_code (code),
  INDEX idx_category (category_id),
  INDEX idx_expiry (expiry_date),
  INDEX idx_active (is_active),
  FULLTEXT INDEX ft_search (title, description, store)
);
\`\`\`

#### Saved Coupons Table
\`\`\`sql
CREATE TABLE saved_coupons (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  coupon_id BIGINT UNSIGNED NOT NULL,
  saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_coupon (user_id, coupon_id),
  INDEX idx_user (user_id),
  INDEX idx_coupon (coupon_id)
);
\`\`\`

#### Coupon Usage Log Table
\`\`\`sql
CREATE TABLE coupon_usage_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  coupon_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED,
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_coupon (coupon_id),
  INDEX idx_user (user_id),
  INDEX idx_used_at (used_at)
);
\`\`\`

### 2.3 Create Migrations
\`\`\`bash
php artisan make:migration create_categories_table
php artisan make:migration create_coupons_table
php artisan make:migration create_saved_coupons_table
php artisan make:migration create_coupon_usage_logs_table
php artisan migrate
\`\`\`

---

## Phase 3: Models and Relationships

### 3.1 Create Models
\`\`\`bash
php artisan make:model Category
php artisan make:model Coupon
php artisan make:model SavedCoupon
php artisan make:model CouponUsageLog
\`\`\`

### 3.2 Define Model Relationships

**User Model (app/Models/User.php):**
\`\`\`php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Model {
  protected $fillable = ['name', 'email', 'password', 'role'];

  public function coupons(): HasMany {
    return $this->hasMany(Coupon::class, 'created_by');
  }

  public function savedCoupons(): BelongsToMany {
    return $this->belongsToMany(Coupon::class, 'saved_coupons');
  }
}
\`\`\`

**Coupon Model (app/Models/Coupon.php):**
\`\`\`php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Coupon extends Model {
  protected $fillable = [
    'title', 'description', 'store', 'discount', 'code',
    'category_id', 'expiry_date', 'usage_count', 'max_usage',
    'is_active', 'created_by'
  ];

  protected $casts = [
    'expiry_date' => 'datetime',
    'is_active' => 'boolean'
  ];

  public function category(): BelongsTo {
    return $this->belongsTo(Category::class);
  }

  public function creator(): BelongsTo {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function savedBy(): BelongsToMany {
    return $this->belongsToMany(User::class, 'saved_coupons');
  }

  public function usageLogs(): HasMany {
    return $this->hasMany(CouponUsageLog::class);
  }
}
\`\`\`

**Category Model (app/Models/Category.php):**
\`\`\`php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model {
  protected $fillable = ['slug', 'name', 'description'];

  public function coupons(): HasMany {
    return $this->hasMany(Coupon::class);
  }
}
\`\`\`

---

## Phase 4: Authentication

### 4.1 Create Auth Controller
\`\`\`bash
php artisan make:controller AuthController
\`\`\`

### 4.2 Implement Authentication (app/Http/Controllers/AuthController.php)

\`\`\`php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller {
  public function register(Request $request) {
    $validated = $request->validate([
      'name' => 'required|string|max:255',
      'email' => 'required|email|unique:users',
      'password' => 'required|string|min:8|confirmed'
    ]);

    $user = User::create([
      'name' => $validated['name'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
      'role' => 'user'
    ]);

    $token = JWTAuth::fromUser($user);

    return response()->json([
      'status' => 'success',
      'data' => [
        'user' => $user,
        'token' => $token
      ]
    ], 201);
  }

  public function login(Request $request) {
    $credentials = $request->validate([
      'email' => 'required|email',
      'password' => 'required|string'
    ]);

    if (!$token = JWTAuth::attempt($credentials)) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'UNAUTHORIZED',
          'message' => 'Invalid credentials'
        ]
      ], 401);
    }

    return response()->json([
      'status' => 'success',
      'data' => [
        'user' => auth()->user(),
        'token' => $token
      ]
    ]);
  }

  public function logout() {
    JWTAuth::invalidate(JWTAuth::getToken());

    return response()->json([
      'status' => 'success',
      'message' => 'Logged out successfully'
    ]);
  }

  public function refresh() {
    $token = JWTAuth::refresh(JWTAuth::getToken());

    return response()->json([
      'status' => 'success',
      'data' => ['token' => $token]
    ]);
  }
}
\`\`\`

---

## Phase 5: API Endpoints Implementation

### 5.1 Create Controllers
\`\`\`bash
php artisan make:controller CouponController --api
php artisan make:controller CategoryController --api
php artisan make:controller SavedCouponController --api
\`\`\`

### 5.2 Coupon Controller (app/Http/Controllers/CouponController.php)

\`\`\`php
<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class CouponController extends Controller {
  public function index(Request $request) {
    $query = Coupon::with('category');

    // Filtering
    if ($request->has('category') && $request->category !== 'All') {
      $query->whereHas('category', function ($q) use ($request) {
        $q->where('name', $request->category);
      });
    }

    // Search
    if ($request->has('search')) {
      $search = $request->search;
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%")
          ->orWhere('store', 'like', "%{$search}%");
      });
    }

    // Sorting
    $sort = $request->get('sort', 'created_at');
    $order = $request->get('order', 'desc');
    $query->orderBy($sort, $order);

    // Pagination
    $page = $request->get('page', 1);
    $limit = min($request->get('limit', 20), 100);
    $coupons = $query->paginate($limit, ['*'], 'page', $page);

    return response()->json([
      'status' => 'success',
      'data' => [
        'coupons' => $coupons->items(),
        'pagination' => [
          'page' => $coupons->currentPage(),
          'limit' => $coupons->perPage(),
          'total' => $coupons->total(),
          'pages' => $coupons->lastPage()
        ]
      ]
    ]);
  }

  public function show($id) {
    $coupon = Cache::remember("coupon.{$id}", 3600, function () use ($id) {
      return Coupon::with('category', 'usageLogs')->find($id);
    });

    if (!$coupon) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'NOT_FOUND',
          'message' => 'Coupon not found'
        ]
      ], 404);
    }

    return response()->json([
      'status' => 'success',
      'data' => $coupon
    ]);
  }

  public function store(Request $request) {
    $this->authorize('create', Coupon::class);

    $validated = $request->validate([
      'title' => 'required|string|max:255',
      'description' => 'required|string',
      'store' => 'required|string|max:255',
      'discount' => 'required|integer|min:1|max:100',
      'code' => 'required|string|unique:coupons|max:50',
      'category_id' => 'required|exists:categories,id',
      'expiry_date' => 'required|date|after:now'
    ]);

    $coupon = Coupon::create([
      ...$validated,
      'created_by' => auth()->id()
    ]);

    Cache::forget('coupons.list');

    return response()->json([
      'status' => 'success',
      'data' => $coupon
    ], 201);
  }

  public function update(Request $request, $id) {
    $coupon = Coupon::find($id);

    if (!$coupon) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'NOT_FOUND',
          'message' => 'Coupon not found'
        ]
      ], 404);
    }

    $this->authorize('update', $coupon);

    $validated = $request->validate([
      'title' => 'sometimes|string|max:255',
      'description' => 'sometimes|string',
      'store' => 'sometimes|string|max:255',
      'discount' => 'sometimes|integer|min:1|max:100',
      'code' => 'sometimes|string|unique:coupons,code,' . $id,
      'category_id' => 'sometimes|exists:categories,id',
      'expiry_date' => 'sometimes|date|after:now'
    ]);

    $coupon->update($validated);

    Cache::forget("coupon.{$id}");
    Cache::forget('coupons.list');

    return response()->json([
      'status' => 'success',
      'data' => $coupon
    ]);
  }

  public function destroy($id) {
    $coupon = Coupon::find($id);

    if (!$coupon) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'NOT_FOUND',
          'message' => 'Coupon not found'
        ]
      ], 404);
    }

    $this->authorize('delete', $coupon);

    $coupon->delete();

    Cache::forget("coupon.{$id}");
    Cache::forget('coupons.list');

    return response()->json([
      'status' => 'success',
      'message' => 'Coupon deleted successfully'
    ]);
  }

  public function search(Request $request) {
    $query = Coupon::with('category');

    if ($request->has('q')) {
      $search = $request->q;
      $query->where(function ($q) use ($search) {
        $q->where('title', 'like', "%{$search}%")
          ->orWhere('description', 'like', "%{$search}%")
          ->orWhere('store', 'like', "%{$search}%");
      });
    }

    if ($request->has('category')) {
      $query->whereHas('category', function ($q) use ($request) {
        $q->where('slug', $request->category);
      });
    }

    if ($request->has('min_discount')) {
      $query->where('discount', '>=', $request->min_discount);
    }

    if ($request->has('max_discount')) {
      $query->where('discount', '<=', $request->max_discount);
    }

    if ($request->has('store')) {
      $query->where('store', 'like', "%{$request->store}%");
    }

    if ($request->get('active_only', true)) {
      $query->where('is_active', true);
    }

    $results = $query->paginate($request->get('limit', 20));

    return response()->json([
      'status' => 'success',
      'data' => [
        'results' => $results->items(),
        'total' => $results->total(),
        'pagination' => [
          'page' => $results->currentPage(),
          'limit' => $results->perPage(),
          'pages' => $results->lastPage()
        ]
      ]
    ]);
  }
}
\`\`\`

### 5.3 Category Controller (app/Http/Controllers/CategoryController.php)

\`\`\`php
<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller {
  public function index() {
    $categories = Cache::remember('categories.all', 604800, function () {
      return Category::withCount('coupons')->get();
    });

    return response()->json([
      'status' => 'success',
      'data' => [
        'categories' => $categories
      ]
    ]);
  }
}
\`\`\`

### 5.4 Saved Coupon Controller (app/Http/Controllers/SavedCouponController.php)

\`\`\`php
<?php

namespace App\Http\Controllers;

use App\Models\SavedCoupon;
use Illuminate\Http\Request;

class SavedCouponController extends Controller {
  public function store(Request $request, $userId) {
    $validated = $request->validate([
      'coupon_id' => 'required|exists:coupons,id'
    ]);

    $existing = SavedCoupon::where('user_id', $userId)
      ->where('coupon_id', $validated['coupon_id'])
      ->first();

    if ($existing) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'CONFLICT',
          'message' => 'Coupon already saved'
        ]
      ], 409);
    }

    $saved = SavedCoupon::create([
      'user_id' => $userId,
      'coupon_id' => $validated['coupon_id']
    ]);

    return response()->json([
      'status' => 'success',
      'data' => $saved
    ], 201);
  }

  public function index($userId) {
    $saved = SavedCoupon::where('user_id', $userId)
      ->with('coupon.category')
      ->paginate(20);

    return response()->json([
      'status' => 'success',
      'data' => [
        'savedCoupons' => $saved->items(),
        'pagination' => [
          'page' => $saved->currentPage(),
          'limit' => $saved->perPage(),
          'total' => $saved->total(),
          'pages' => $saved->lastPage()
        ]
      ]
    ]);
  }

  public function destroy($userId, $couponId) {
    $saved = SavedCoupon::where('user_id', $userId)
      ->where('coupon_id', $couponId)
      ->first();

    if (!$saved) {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'NOT_FOUND',
          'message' => 'Saved coupon not found'
        ]
      ], 404);
    }

    $saved->delete();

    return response()->json([
      'status' => 'success',
      'message' => 'Coupon removed from saved collection'
    ]);
  }
}
\`\`\`

---

## Phase 6: API Routes

### 6.1 Define Routes (routes/api.php)

\`\`\`php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CouponController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SavedCouponController;

Route::prefix('v1')->group(function () {
  // Public routes
  Route::post('/auth/register', [AuthController::class, 'register']);
  Route::post('/auth/login', [AuthController::class, 'login']);
  Route::get('/coupons', [CouponController::class, 'index']);
  Route::get('/coupons/{id}', [CouponController::class, 'show']);
  Route::get('/coupons/search', [CouponController::class, 'search']);
  Route::get('/categories', [CategoryController::class, 'index']);

  // Protected routes
  Route::middleware('auth:api')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);

    // Admin routes
    Route::middleware('admin')->group(function () {
      Route::post('/coupons', [CouponController::class, 'store']);
      Route::put('/coupons/{id}', [CouponController::class, 'update']);
      Route::delete('/coupons/{id}', [CouponController::class, 'destroy']);
    });

    // User saved coupons
    Route::post('/users/{userId}/saved-coupons', [SavedCouponController::class, 'store']);
    Route::get('/users/{userId}/saved-coupons', [SavedCouponController::class, 'index']);
    Route::delete('/users/{userId}/saved-coupons/{couponId}', [SavedCouponController::class, 'destroy']);
  });
});
\`\`\`

---

## Phase 7: Middleware and Security

### 7.1 Create Admin Middleware
\`\`\`bash
php artisan make:middleware AdminMiddleware
\`\`\`

### 7.2 Implement Admin Middleware (app/Http/Middleware/AdminMiddleware.php)

\`\`\`php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware {
  public function handle(Request $request, Closure $next) {
    if (auth()->user()->role !== 'admin') {
      return response()->json([
        'status' => 'error',
        'error' => [
          'code' => 'FORBIDDEN',
          'message' => 'Insufficient permissions'
        ]
      ], 403);
    }

    return $next($request);
  }
}
\`\`\`

### 7.3 Register Middleware (app/Http/Kernel.php)

\`\`\`php
protected $routeMiddleware = [
  // ... existing middleware
  'admin' => \App\Http\Middleware\AdminMiddleware::class,
];
\`\`\`

---

## Phase 8: Testing

### 8.1 Create Tests
\`\`\`bash
php artisan make:test CouponApiTest
php artisan make:test AuthApiTest
\`\`\`

### 8.2 Example Tests (tests/Feature/CouponApiTest.php)

\`\`\`php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Coupon;
use App\Models\Category;

class CouponApiTest extends TestCase {
  public function test_can_retrieve_coupons() {
    $response = $this->getJson('/api/v1/coupons');
    $response->assertStatus(200);
    $response->assertJsonStructure([
      'status',
      'data' => [
        'coupons' => [
          '*' => ['id', 'title', 'discount', 'code']
        ],
        'pagination'
      ]
    ]);
  }

  public function test_can_create_coupon_as_admin() {
    $admin = User::factory()->create(['role' => 'admin']);
    $category = Category::factory()->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/coupons', [
      'title' => 'Test Coupon',
      'description' => 'Test Description',
      'store' => 'Test Store',
      'discount' => 25,
      'code' => 'TEST25',
      'category_id' => $category->id,
      'expiry_date' => now()->addMonth()
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('coupons', ['code' => 'TEST25']);
  }

  public function test_cannot_create_coupon_as_user() {
    $user = User::factory()->create(['role' => 'user']);
    $category = Category::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/v1/coupons', [
      'title' => 'Test Coupon',
      'discount' => 25,
      'code' => 'TEST25',
      'category_id' => $category->id,
      'expiry_date' => now()->addMonth()
    ]);

    $response->assertStatus(403);
  }
}
\`\`\`

---

## Phase 9: Deployment

### 9.1 Production Checklist
- [ ] Set `APP_DEBUG=false`
- [ ] Generate application key: `php artisan key:generate`
- [ ] Set up database backups
- [ ] Configure JWT secret
- [ ] Set up SSL/HTTPS
- [ ] Configure CORS properly
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Set up automated tests in CI/CD
- [ ] Configure Redis for caching

### 9.2 Production Environment Variables
\`\`\`
APP_ENV=production
APP_DEBUG=false
DB_HOST=production-db-host
DB_DATABASE=coupon_deals_prod
JWT_SECRET=production-secret-key
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
\`\`\`

---

## Phase 10: Performance Optimization

### 10.1 Database Optimization
- Add indexes on frequently queried columns (already done in schema)
- Use eager loading to prevent N+1 queries
- Implement query caching with Redis
- Archive old usage logs periodically

### 10.2 API Optimization
- Implement pagination (default 20 items, max 100)
- Use field selection to reduce payload
- Compress responses with gzip
- Implement CDN for static assets

### 10.3 Caching Strategy
\`\`\`php
// Cache coupons list for 1 hour
Cache::remember('coupons.list', 3600, function () {
  return Coupon::with('category')->get();
});

// Cache single coupon for 24 hours
Cache::remember("coupon.{$id}", 86400, function () {
  return Coupon::with('category', 'usageLogs')->find($id);
});

// Cache categories for 7 days
Cache::remember('categories.all', 604800, function () {
  return Category::withCount('coupons')->get();
});
\`\`\`

---

## Phase 11: Monitoring and Logging

### 11.1 Error Tracking
- Set up Sentry for error tracking
- Monitor API response times
- Track database query performance
- Monitor server resources

### 11.2 Logging Configuration (config/logging.php)
\`\`\`php
'channels' => [
  'stack' => [
    'driver' => 'stack',
    'channels' => ['single', 'sentry'],
  ],
  'sentry' => [
    'driver' => 'sentry',
  ],
],
\`\`\`

---

## Phase 12: Additional Features

### 12.1 Email Notifications
- Send coupon expiry reminders
- Send new coupon notifications to subscribed users
- Send promotional emails

### 12.2 Analytics
- Track coupon usage statistics
- Track user engagement
- Generate reports for admins

### 12.3 Admin Dashboard
- Coupon management interface
- User management
- Analytics and reporting
- System settings

---


## Resources

- [Laravel Documentation](https://laravel.com/docs)
- [JWT Authentication](https://jwt.io)
- [MySQL Best Practices](https://dev.mysql.com)
- [RESTful API Design](https://restfulapi.net)
- [API Security](https://owasp.org/www-project-api-security)
- [Laravel Testing](https://laravel.com/docs/testing)
