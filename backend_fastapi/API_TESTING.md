# API Testing Guide

## Using Swagger UI (Recommended)

1. Start the server:
```bash
uvicorn app.main:app --reload
```

2. Open http://localhost:5000/docs in your browser

3. Test endpoints interactively

## Using curl (PowerShell)

### 1. Health Check
```powershell
curl http://localhost:5000/api/ping
```

### 2. Register User
```powershell
$body = @{
    fullName = "Test User"
    email = "test@example.com"
    password = "Password123"
    phoneNumber = "081234567890"
    accountNumber = "1234567890123"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/auth/signup `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

### 3. Login
```powershell
$loginBody = @{
    email = "test@example.com"
    password = "Password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri http://localhost:5000/api/auth/login `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginBody

# Save token
$token = $response.data.token
Write-Host "Token: $token"
```

### 4. Get User Profile (Authenticated)
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri http://localhost:5000/api/auth/me `
    -Method Get `
    -Headers $headers
```

### 5. Transfer Money (Authenticated)
```powershell
$transferBody = @{
    toAccount = "0987654321098"
    amount = 50000
    description = "Test transfer"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:5000/api/transfer `
    -Method Post `
    -ContentType "application/json" `
    -Headers $headers `
    -Body $transferBody
```

### 6. Get Transactions (Authenticated)
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/transactions?limit=10" `
    -Method Get `
    -Headers $headers
```

### 7. Get Stock Data
```powershell
Invoke-RestMethod -Uri http://localhost:5000/api/stock/bbri
```

### 8. Get Articles
```powershell
# Get all articles in Indonesian
Invoke-RestMethod -Uri "http://localhost:5000/api/articles?lang=id"

# Get article by slug
Invoke-RestMethod -Uri "http://localhost:5000/api/articles/slug/cara-transfer-bri?lang=id"

# Get articles by category
Invoke-RestMethod -Uri "http://localhost:5000/api/articles/category/Tutorial?lang=id"
```

### 9. Create Article (Authenticated)
```powershell
$articleBody = @{
    translations = @(
        @{
            lang = "id"
            title = "Tutorial Transfer BRI"
            slug = "tutorial-transfer-bri"
            content = @(
                @{
                    type = "text"
                    value = "Ini adalah paragraf pertama."
                }
            )
        }
    )
    category = "Tutorial"
    author = "Admin BRI"
    coverImage = "https://example.com/image.jpg"
    status = "published"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri http://localhost:5000/api/articles `
    -Method Post `
    -ContentType "application/json" `
    -Headers $headers `
    -Body $articleBody
```

## Using Postman

1. Import the OpenAPI spec from: http://localhost:5000/openapi.json
2. Set up environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: (obtained from login response)
3. Use `{{baseUrl}}` and `{{token}}` in your requests

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "detail": "Error message"
}
```

### List Response
```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```
