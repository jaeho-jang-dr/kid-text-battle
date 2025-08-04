# Profile API Documentation

## Overview
The Profile API allows authenticated users to view and manage their profile information, including account details, statistics, and character summaries.

## Base URL
```
/api/profile
```

## Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <token>
```

## Endpoints

### GET /api/profile
Retrieve the authenticated user's profile information.

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "user-uuid",
      "username": "testuser",
      "email": "test@example.com",
      "created_at": "2025-07-28T16:57:18Z",
      "statistics": {
        "character_count": 3,
        "total_battles": 150,
        "total_wins": 85,
        "win_rate": 57
      },
      "status": {
        "warning_count": 0,
        "is_suspended": false,
        "suspended_until": null,
        "suspension_reason": null
      }
    },
    "characters": [
      {
        "id": "character-uuid",
        "name": "황금갈기",
        "animal": {
          "id": 1,
          "name": "Lion",
          "emoji": "🦁"
        },
        "stats": {
          "battle_score": 2940,
          "elo_score": 1543,
          "win_count": 64,
          "loss_count": 25,
          "battle_count": 89,
          "win_rate": 72
        }
      }
    ]
  }
}
```

### PATCH /api/profile
Update user profile information.

**Request Body:**
```json
{
  "username": "newusername",        // Optional: 2-20 characters
  "email": "newemail@example.com",  // Optional: Valid email format
  "currentPassword": "1234",        // Required when changing password
  "newPassword": "5678"             // Optional: 4-20 characters
}
```

**Validation Rules:**
- Username: 2-20 characters, no profanity, must be unique
- Email: Valid email format, must be unique
- Password: 4-20 characters, current password required for change

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "username": "newusername",
      "email": "newemail@example.com",
      "created_at": "2025-07-28T16:57:18Z",
      "updated_at": "2025-08-04T10:30:00Z"
    },
    "message": "프로필이 성공적으로 업데이트되었습니다"
  }
}
```

### DELETE /api/profile
Delete user account (soft delete).

**Request Body:**
```json
{
  "password": "current-password",
  "confirmDelete": true
}
```

**Effects:**
- Marks user as deleted (soft delete)
- Marks all user's characters as deleted
- Invalidates authentication tokens
- Appends timestamp to username/email to free them for reuse

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "계정이 성공적으로 삭제되었습니다. 안녕히 가세요!"
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "사용자명은 2-20자 사이여야 합니다"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "인증이 필요합니다"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "사용자를 찾을 수 없습니다"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "프로필을 불러오는 중 오류가 발생했습니다"
}
```

## Content Filtering
- Username changes are subject to content filtering
- Profanity and inappropriate content will be rejected
- Ten Commandments violations are silently logged

## Database Schema Requirements
The following columns must exist in the users table:
- `username` (TEXT)
- `password` (TEXT)
- `is_deleted` (INTEGER)
- `deleted_at` (TEXT)
- `updated_at` (TEXT)
- `suspended_until` (TEXT)
- `suspension_reason` (TEXT)

Run `node add-profile-columns.js` to add missing columns.

## Example Usage

```javascript
// Get profile
const response = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Update username
const response = await fetch('/api/profile', {
  method: 'PATCH',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'newusername'
  })
});

// Delete account
const response = await fetch('/api/profile', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    password: 'mypassword',
    confirmDelete: true
  })
});
```