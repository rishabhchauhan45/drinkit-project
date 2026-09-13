# DrinkIt Auth API Tests

Use these `curl` commands to quickly test the authentication endpoints locally.
Make sure your server is running on `http://localhost:5000`.

## 1. Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user1@example.com",
  "phone": "5551234567",
  "name": "John Doe",
  "age": 21,
  "password": "securepassword123"
}'
```
*(Copy the `token` from the response for the next steps)*

## 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user1@example.com",
  "password": "securepassword123"
}'
```

## 3. Get Profile (Protected)
Replace `YOUR_TOKEN_HERE` with the token received from login/register.
```bash
curl -X GET http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Update Profile (Protected)
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer YOUR_TOKEN_HERE" \
-H "Content-Type: application/json" \
-d '{
  "name": "Johnathan Doe",
  "phone": "5559876543"
}'
```

## 5. Verify Age (Protected)
```bash
curl -X POST http://localhost:5000/api/auth/verify-age \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```
