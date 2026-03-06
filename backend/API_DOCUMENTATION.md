# BestUp Backend - API Documentation (Phase 1)

## Authentication Endpoints

### 1. Register User
- **Route:** `POST /api/auth/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "token": "jwt_token_here",
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "emailVerified": false
    }
  }
  ```

### 2. Login User
- **Route:** `POST /api/auth/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response:** Bearer token + user data

### 3. Verify Email
- **Route:** `POST /api/auth/verify-email`
- **Access:** Public
- **Body:**
  ```json
  {
    "token": "verification_token_from_email"
  }
  ```

### 4. Forgot Password
- **Route:** `POST /api/auth/forgot-password`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Response:** Reset link sent to email

### 5. Reset Password
- **Route:** `POST /api/auth/reset-password`
- **Access:** Public
- **Body:**
  ```json
  {
    "token": "reset_token_from_email",
    "password": "newpassword123"
  }
  ```

### 6. Get Current User
- **Route:** `GET /api/auth/me`
- **Access:** Private (Requires Bearer token)
- **Headers:**
  ```
  Authorization: Bearer <token>
  ```

---

## Review Endpoints

### 1. Get Phone Reviews
- **Route:** `GET /api/reviews/phone/:phoneId`
- **Access:** Public
- **Query Parameters:**
  - `page` (default: 1)
  - `limit` (default: 10)
  - `sortBy` (default: -createdAt)
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "phone": { "id": "...", "name": "..." },
      "reviews": [...],
      "pagination": {...},
      "stats": {
        "averageRating": 4.5,
        "totalReviews": 24,
        "ratingDistribution": { "5": 10, "4": 8, ... }
      }
    }
  }
  ```

### 2. Add Review
- **Route:** `POST /api/reviews`
- **Access:** Private (Requires Bearer token)
- **Body:**
  ```json
  {
    "phoneId": "phone_id",
    "rating": 5,
    "title": "Amazing phone!",
    "content": "This phone has the best camera I've ever seen..."
  }
  ```

### 3. Update Review
- **Route:** `PUT /api/reviews/:reviewId`
- **Access:** Private (Only review owner or admin)
- **Body:** Same as Add Review

### 4. Delete Review
- **Route:** `DELETE /api/reviews/:reviewId`
- **Access:** Private (Only review owner or admin)

### 5. Mark Review Helpful
- **Route:** `PUT /api/reviews/:reviewId/helpful`
- **Access:** Private
- **Body:**
  ```json
  {
    "helpful": true
  }
  ```

### 6. Get User Reviews
- **Route:** `GET /api/reviews/user/:userId`
- **Access:** Public

---

## Wishlist Endpoints

### 1. Get Wishlist
- **Route:** `GET /api/wishlist`
- **Access:** Private
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "count": 5,
      "phones": [...]
    }
  }
  ```

### 2. Add to Wishlist
- **Route:** `POST /api/wishlist/:phoneId`
- **Access:** Private

### 3. Remove from Wishlist
- **Route:** `DELETE /api/wishlist/:phoneId`
- **Access:** Private

---

## Comparison Endpoints

### 1. Get Comparison List
- **Route:** `GET /api/comparison`
- **Access:** Private

### 2. Add to Comparison
- **Route:** `POST /api/comparison/:phoneId`
- **Access:** Private
- **Note:** Max 5 phones allowed

### 3. Remove from Comparison
- **Route:** `DELETE /api/comparison/:phoneId`
- **Access:** Private

### 4. Clear Comparison List
- **Route:** `DELETE /api/comparison`
- **Access:** Private

---

## Error Handling

All errors follow a consistent format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    "Validation error 1",
    "Validation error 2"
  ]
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden (No permission)
- `404` - Not Found
- `500` - Server Error

---

## Bearer Token Usage

All private endpoints require this header:
```
Authorization: Bearer <your_jwt_token>
```

### Example:
```bash
curl -H "Authorization: Bearer eyJhbGc..." \
  https://api.bestup.com/api/auth/me
```

---

## Notes

1. **Email Verification:** Currently logs token to console (implement email service in production)
2. **Password Reset:** Currently logs token to console (implement email service in production)
3. **Wishlist:** Can add unlimited phones
4. **Comparison:** Limit is 5 phones per user
5. **Reviews:** One review per phone per user
6. **Admin Features:** Admin can delete any review or manage users

---

## Testing Recommended Order

1. Register new user
2. Login with credentials
3. Get current user details
4. Add phone to wishlist
5. Add phone to comparison
6. Create a review
7. Get phone reviews
8. Mark review helpful

---

## Future Enhancements

- Email verification implementation (Nodemailer)
- Price drop alerts
- Smart recommendations
- Analytics tracking
- Advanced filtering
- Redis caching
