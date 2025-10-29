# API Documentation

Base URL: `http://localhost:5000/api/v1`

## Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## User Routes

### Register User
```http
POST /users/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "password123",
  "passwordConfirm": "password123",
  "role": "customer",
  "address": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  }
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

### Login
```http
POST /users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

### Update Profile
```http
PATCH /users/updateMe
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "phone": "+919876543211"
}
```

### Get My Subscriptions
```http
GET /users/my-subscriptions
Authorization: Bearer <token>
```

### Get Distribution List (Distributor only)
```http
GET /users/my-distribution-list
Authorization: Bearer <token>
```

---

## Newspaper Routes

### Get All Newspapers
```http
GET /newspapers
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100)
- `sort` - Sort by field (e.g., `-createdAt`, `price.monthly`)
- `fields` - Select specific fields (e.g., `name,price,publisher`)

**Example:**
```http
GET /newspapers?page=1&limit=10&sort=-ratingsAverage
```

### Get Newspaper by ID
```http
GET /newspapers/:id
```

### Search Newspapers
```http
GET /newspapers/search?search=times
```

### Create Newspaper (Admin only)
```http
POST /newspapers
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "The Times of India",
  "description": "India's leading English daily",
  "publisher": "Bennett, Coleman & Co.",
  "languages": ["English"],
  "categories": ["daily", "business"],
  "price": {
    "monthly": 300,
    "quarterly": 850,
    "yearly": 3200
  },
  "coverImage": "https://example.com/cover.jpg"
}
```

### Update Newspaper (Admin only)
```http
PATCH /newspapers/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": {
    "monthly": 350
  }
}
```

### Delete Newspaper (Admin only)
```http
DELETE /newspapers/:id
Authorization: Bearer <admin_token>
```

---

## Subscription Routes

### Create Subscription
```http
POST /subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "newspaperId": "64abc123...",
  "subscriptionType": "monthly",
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "location": {
      "type": "Point",
      "coordinates": [72.8777, 19.0760],
      "address": "123 Main St, Mumbai, Maharashtra - 400001"
    }
  },
  "deliveryTime": "Morning (6-8 AM)"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": {
      "_id": "64def456...",
      "user": {...},
      "newspaper": {...},
      "distributor": {...},
      "startDate": "2024-01-01T00:00:00.000Z",
      "endDate": "2024-02-01T00:00:00.000Z",
      "status": "pending_payment",
      "deliveryAddress": {...},
      "deliveryTime": "Morning (6-8 AM)"
    }
  }
}
```

### Get All Subscriptions
```http
GET /subscriptions
Authorization: Bearer <token>
```

### Get Subscription by ID
```http
GET /subscriptions/:id
Authorization: Bearer <token>
```

### Update Subscription
```http
PATCH /subscriptions/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "deliveryTime": "Evening (5-7 PM)"
}
```

### Cancel Subscription
```http
DELETE /subscriptions/:id
Authorization: Bearer <token>
```

---

## Payment Routes

### Create Payment Order
```http
POST /payments/create-order
Authorization: Bearer <token>
Content-Type: application/json

{
  "subscriptionId": "64def456..."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "order_xxx",
      "amount": 30000,
      "currency": "INR",
      "receipt": "sub_64def456_1234567890"
    },
    "key": "rzp_test_xxxxx"
  }
}
```

### Verify Payment
```http
POST /payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

### Get Payment Details
```http
GET /payments/:subscriptionId
Authorization: Bearer <token>
```

### Process Refund (Admin only)
```http
POST /payments/refund
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "paymentId": "pay_xxx",
  "amount": 300,
  "reason": "Customer request"
}
```

### Get All Payments (Admin only)
```http
GET /payments
Authorization: Bearer <admin_token>
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "fail",
  "message": "Error message here"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Razorpay Test Cards

For testing payments in test mode:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failed Payment:**
- Card Number: `4000 0000 0000 0002`

---

## Rate Limiting

API requests are limited to:
- 100 requests per 15 minutes per IP

---

## Pagination

For routes that return lists, use:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 100, max: 100)

Example:
```http
GET /newspapers?page=2&limit=20
```

Response includes:
```json
{
  "status": "success",
  "results": 20,
  "data": {
    "newspapers": [...]
  }
}
```

---

## Filtering

Use MongoDB query operators:
```http
GET /newspapers?price[monthly][gte]=200&price[monthly][lte]=500
```

Operators:
- `gte` - Greater than or equal
- `gt` - Greater than
- `lte` - Less than or equal
- `lt` - Less than

---

## Sorting

Sort by any field:
```http
GET /newspapers?sort=-ratingsAverage,price.monthly
```

- Prefix with `-` for descending order
- Separate multiple fields with commas

---

## Field Limiting

Select specific fields:
```http
GET /newspapers?fields=name,price,publisher
```

Exclude fields with `-`:
```http
GET /newspapers?fields=-description,-images
```
