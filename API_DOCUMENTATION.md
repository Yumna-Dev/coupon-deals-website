# Coupon Deals API Documentation

## Overview
This document outlines the REST API endpoints for the Coupon Deals platform. The API follows RESTful principles and returns JSON responses. It's designed to support the React Vite frontend with features for browsing, searching, filtering, and saving coupons.

## Base URL
\`\`\`
https://api.coupon-deals.com
\`\`\`

## Authentication
All endpoints require Bearer token authentication in the Authorization header:
\`\`\`
Authorization: Bearer {access_token}
\`\`\`

## Data Structure

### Coupon Object
\`\`\`json
{
  "id": "1",
  "title": "Premium Wireless Headphones",
  "description": "High-quality noise-cancelling headphones with 30-hour battery",
  "store": "AudioTech Store",
  "category": "electronics",
  "discount": 35,
  "code": "AUDIO35",
  "expiryDate": "2025-11-17T00:00:00Z",
  "isSaved": false,
  "createdAt": "2025-10-17T10:30:00Z",
  "updatedAt": "2025-10-17T10:30:00Z"
}
\`\`\`

---

## Endpoints

### 1. Get All Coupons
**Endpoint:** `GET /coupons`

**Description:** Retrieve a paginated list of all available coupons with optional filtering.

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20, max: 100)
- `category` (string, optional): Filter by category (electronics, fashion, food, travel, home)
- `search` (string, optional): Search by title, description, or store name
- `sort` (string, optional): Sort by field (discount, expiryDate, createdAt)
- `order` (string, optional): Sort order (asc, desc)

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "coupons": [
      {
        "id": "1",
        "title": "Premium Wireless Headphones",
        "description": "High-quality noise-cancelling headphones",
        "store": "AudioTech Store",
        "category": "electronics",
        "discount": 35,
        "code": "AUDIO35",
        "expiryDate": "2025-11-17T00:00:00Z",
        "isSaved": false,
        "createdAt": "2025-10-17T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Missing or invalid token

---

### 2. Get Single Coupon
**Endpoint:** `GET /coupons/{id}`

**Description:** Retrieve detailed information about a specific coupon.

**Path Parameters:**
- `id` (string, required): Coupon ID

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "1",
    "title": "Premium Wireless Headphones",
    "description": "High-quality noise-cancelling headphones with 30-hour battery life",
    "store": "AudioTech Store",
    "category": "electronics",
    "discount": 35,
    "code": "AUDIO35",
    "expiryDate": "2025-11-17T00:00:00Z",
    "isSaved": false,
    "usageCount": 245,
    "createdAt": "2025-10-17T10:30:00Z",
    "updatedAt": "2025-10-17T10:30:00Z"
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Success
- `404 Not Found`: Coupon not found
- `401 Unauthorized`: Missing or invalid token

---

### 3. Search Coupons
**Endpoint:** `GET /coupons/search`

**Description:** Advanced search for coupons with multiple filters and smart category matching.

**Query Parameters:**
- `q` (string, required): Search query (searches title, description, store, category)
- `category` (string, optional): Filter by specific category
- `minDiscount` (integer, optional): Minimum discount percentage
- `maxDiscount` (integer, optional): Maximum discount percentage
- `store` (string, optional): Filter by store name
- `activeOnly` (boolean, optional): Only show active coupons (default: true)
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "1",
        "title": "Premium Wireless Headphones",
        "description": "High-quality noise-cancelling headphones",
        "store": "AudioTech Store",
        "category": "electronics",
        "discount": 35,
        "code": "AUDIO35",
        "isSaved": false,
        "relevanceScore": 0.95
      }
    ],
    "total": 42,
    "pagination": {
      "page": 1,
      "limit": 20,
      "pages": 3
    }
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Success
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Missing or invalid token

---

### 4. Get Categories
**Endpoint:** `GET /categories`

**Description:** Retrieve all available coupon categories with coupon counts.

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "electronics",
        "name": "Electronics",
        "description": "Tech gadgets and devices",
        "couponCount": 45
      },
      {
        "id": "fashion",
        "name": "Fashion",
        "description": "Clothing and accessories",
        "couponCount": 38
      },
      {
        "id": "food",
        "name": "Food & Dining",
        "description": "Restaurants and food delivery",
        "couponCount": 52
      },
      {
        "id": "travel",
        "name": "Travel",
        "description": "Hotels, flights, and tours",
        "couponCount": 28
      },
      {
        "id": "home",
        "name": "Home & Garden",
        "description": "Home improvement and furniture",
        "couponCount": 35
      }
    ]
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Success
- `401 Unauthorized`: Missing or invalid token

---

### 5. Save Coupon
**Endpoint:** `POST /users/{userId}/saved-coupons`

**Description:** Save a coupon to the user's collection.

**Path Parameters:**
- `userId` (string, required): User ID

**Request Body:**
\`\`\`json
{
  "couponId": "1"
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "saved_1",
    "userId": "user_123",
    "couponId": "1",
    "savedAt": "2025-10-17T16:15:00Z"
  }
}
\`\`\`

**Status Codes:**
- `201 Created`: Coupon saved successfully
- `400 Bad Request`: Invalid data
- `409 Conflict`: Coupon already saved
- `401 Unauthorized`: Missing or invalid token

---

### 6. Get Saved Coupons
**Endpoint:** `GET /users/{userId}/saved-coupons`

**Description:** Retrieve all coupons saved by a specific user.

**Path Parameters:**
- `userId` (string, required): User ID

**Query Parameters:**
- `page` (integer, optional): Page number (default: 1)
- `limit` (integer, optional): Items per page (default: 20)
- `category` (string, optional): Filter by category
- `search` (string, optional): Search saved coupons

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "savedCoupons": [
      {
        "id": "saved_1",
        "coupon": {
          "id": "1",
          "title": "Premium Wireless Headphones",
          "description": "High-quality noise-cancelling headphones",
          "store": "AudioTech Store",
          "category": "electronics",
          "discount": 35,
          "code": "AUDIO35",
          "expiryDate": "2025-11-17T00:00:00Z",
          "isSaved": true
        },
        "savedAt": "2025-10-17T16:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5,
      "pages": 1
    }
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Success
- `404 Not Found`: User not found
- `401 Unauthorized`: Missing or invalid token

---

### 7. Remove Saved Coupon
**Endpoint:** `DELETE /users/{userId}/saved-coupons/{couponId}`

**Description:** Remove a coupon from the user's saved collection.

**Path Parameters:**
- `userId` (string, required): User ID
- `couponId` (string, required): Coupon ID

**Response:**
\`\`\`json
{
  "status": "success",
  "message": "Coupon removed from saved collection"
}
\`\`\`

**Status Codes:**
- `200 OK`: Coupon removed successfully
- `404 Not Found`: Saved coupon not found
- `401 Unauthorized`: Missing or invalid token

---

### 8. Create Coupon (Admin Only)
**Endpoint:** `POST /coupons`

**Description:** Create a new coupon (requires admin role).

**Request Body:**
\`\`\`json
{
  "title": "New Deal",
  "description": "Amazing discount on products",
  "store": "Store Name",
  "category": "electronics",
  "discount": 25,
  "code": "NEWDEAL25",
  "expiryDate": "2025-12-31T23:59:59Z"
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "123",
    "title": "New Deal",
    "description": "Amazing discount on products",
    "store": "Store Name",
    "category": "electronics",
    "discount": 25,
    "code": "NEWDEAL25",
    "expiryDate": "2025-12-31T23:59:59Z",
    "isSaved": false,
    "createdAt": "2025-10-17T15:45:00Z"
  }
}
\`\`\`

**Status Codes:**
- `201 Created`: Coupon created successfully
- `400 Bad Request`: Invalid data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### 9. Update Coupon (Admin Only)
**Endpoint:** `PUT /coupons/{id}`

**Description:** Update an existing coupon (requires admin role).

**Path Parameters:**
- `id` (string, required): Coupon ID

**Request Body:**
\`\`\`json
{
  "title": "Updated Deal",
  "discount": 30,
  "expiryDate": "2025-12-31T23:59:59Z"
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "data": {
    "id": "123",
    "title": "Updated Deal",
    "discount": 30,
    "expiryDate": "2025-12-31T23:59:59Z",
    "updatedAt": "2025-10-17T16:00:00Z"
  }
}
\`\`\`

**Status Codes:**
- `200 OK`: Coupon updated successfully
- `400 Bad Request`: Invalid data
- `404 Not Found`: Coupon not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

### 10. Delete Coupon (Admin Only)
**Endpoint:** `DELETE /coupons/{id}`

**Description:** Delete a coupon (requires admin role).

**Path Parameters:**
- `id` (string, required): Coupon ID

**Response:**
\`\`\`json
{
  "status": "success",
  "message": "Coupon deleted successfully"
}
\`\`\`

**Status Codes:**
- `200 OK`: Coupon deleted successfully
- `404 Not Found`: Coupon not found
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions

---

## Error Responses

All error responses follow this format:

\`\`\`json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
\`\`\`

### Common Error Codes:
- `INVALID_REQUEST`: Request validation failed
- `UNAUTHORIZED`: Authentication failed
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMIT`: Too many requests
- `SERVER_ERROR`: Internal server error

---

## Rate Limiting

- **Limit:** 1000 requests per hour per API key
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

---

## Pagination

All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
\`\`\`json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
\`\`\`

---

## Versioning

The API uses URL versioning. Current version is `v1`. Future versions will be available at `/v2`, `/v3`, etc.

---

## Frontend Integration Example

### React Hook for Fetching Coupons
\`\`\`javascript
import { useState, useEffect } from 'react';

function useCoupons(category = 'All', searchTerm = '') {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'All') params.append('category', category);
        if (searchTerm) params.append('search', searchTerm);

        const response = await fetch(
          `https://api.coupon-deals.com/v1/coupons?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        const data = await response.json();
        setCoupons(data.data.coupons);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [category, searchTerm]);

  return { coupons, loading, error };
}
\`\`\`

### Saving a Coupon
\`\`\`javascript
async function saveCoupon(userId, couponId) {
  const response = await fetch(
    `https://api.coupon-deals.com/v1/users/${userId}/saved-coupons`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ couponId })
    }
  );
  
  return response.json();
}
\`\`\`

---

## Webhooks

The API supports webhooks for real-time events:

### Supported Events:
- `coupon.created`: New coupon added
- `coupon.updated`: Coupon details changed
- `coupon.expired`: Coupon expiration date reached
- `coupon.deleted`: Coupon removed

### Webhook Payload:
\`\`\`json
{
  "event": "coupon.created",
  "timestamp": "2025-10-17T16:30:00Z",
  "data": {
    "id": "1",
    "title": "Premium Wireless Headphones",
    "discount": 35,
    "category": "electronics"
  }
}
\`\`\`

To register a webhook, contact the API support team.
