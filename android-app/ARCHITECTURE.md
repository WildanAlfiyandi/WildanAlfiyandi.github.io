# Architecture Documentation

## Digital Platform Android Application - Complete Architecture

### Overview

Aplikasi ini adalah platform digital produk dengan fitur lengkap untuk authentication, payment, dan admin panel. Saat ini adalah **UI Prototype** yang siap untuk integrasi backend.

## Architecture Layers

### 1. Presentation Layer (UI) ✅ IMPLEMENTED
- **Splash Screen**: Animasi pembuka aplikasi
- **Authentication UI**: Login, Register, Email Verification
- **Dashboard**: Produk digital, saldo, quick actions  
- **Payment UI**: QRIS, Dana, GoPay, OVO
- **Admin Panel**: Deploy website, Spotify player, Analytics

### 2. Business Logic Layer (Mock) ✅ IMPLEMENTED
- Mock authentication flows
- Mock payment processing
- Mock admin features
- Navigation and state management

### 3. Data Layer ⚠️ REQUIRES BACKEND
Memerlukan backend API untuk:
- User authentication
- Product management
- Payment processing
- Admin operations

## Backend Requirements

### Required Services

#### 1. Authentication Service
**Fungsi:**
- User registration dengan email verification
- Login dengan email/password
- OAuth integration (Google, Facebook)
- Guest access
- Session management

**Tech Stack Recommendation:**
- **Backend**: Node.js (Express) atau Python (FastAPI/Django)
- **Database**: PostgreSQL atau MongoDB
- **Auth**: JWT tokens, OAuth 2.0
- **Email**: SendGrid, AWS SES, atau Mailgun

**API Endpoints Needed:**
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/verify-email
POST /api/auth/google
POST /api/auth/facebook
GET  /api/auth/me
POST /api/auth/logout
```

#### 2. Email Verification Service
**Fungsi:**
- Mengirim kode verifikasi ke email
- Validasi kode verifikasi
- Resend code functionality

**Implementation:**
```javascript
// Example Node.js
const sendVerificationEmail = async (email, code) => {
  await emailService.send({
    to: email,
    subject: 'Verification Code',
    template: 'verification',
    data: { code }
  });
};
```

#### 3. Payment Gateway Integration
**Providers yang perlu diintegrasikan:**
- **QRIS**: Midtrans, Xendit, atau DOKU
- **Dana**: Dana Business API
- **GoPay**: Gojek Business API
- **OVO**: OVO Business API

**Requirements:**
- Merchant account untuk setiap provider
- API keys dan secret keys
- Webhook untuk payment notifications
- Transaction logging

**API Endpoints Needed:**
```
POST /api/payment/create
GET  /api/payment/status/:id
POST /api/payment/webhook/:provider
GET  /api/payment/history
```

**Example Integration (Midtrans):**
```javascript
const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY
});

const createTransaction = async (orderId, amount, customerDetails) => {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount
    },
    customer_details: customerDetails
  };
  
  return await snap.createTransaction(parameter);
};
```

#### 4. Product Management Service
**Fungsi:**
- CRUD operations untuk produk digital
- Kategori produk
- Pricing dan inventory
- Product search dan filter

**Database Schema:**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  category VARCHAR(100),
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_id UUID REFERENCES products(id),
  transaction_id VARCHAR(255),
  status VARCHAR(50),
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Admin Panel Backend
**Features Required:**
- Website deployment system
- Spotify API integration
- Analytics dashboard
- User management

**Tech Requirements:**

**a) Website Deployment:**
```javascript
// Using GitHub API or direct FTP
const deployWebsite = async (repoUrl, targetDomain) => {
  // Clone repository
  // Build if needed
  // Deploy to hosting (Vercel, Netlify, custom server)
  // Return deployment URL
};
```

**b) Spotify Integration:**
- Spotify Developer Account
- Client ID dan Client Secret
- Spotify Web API

```javascript
const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET
});
```

**c) Analytics:**
- Google Analytics integration
- Custom analytics dashboard
- Real-time statistics

## Android App Backend Integration

### 1. Network Layer (Retrofit/Volley)

**build.gradle dependencies:**
```gradle
dependencies {
    // Retrofit for API calls
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    
    // OkHttp for HTTP client
    implementation 'com.squareup.okhttp3:okhttp:4.11.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.11.0'
}
```

**API Service Interface:**
```java
public interface ApiService {
    @POST("api/auth/login")
    Call<LoginResponse> login(@Body LoginRequest request);
    
    @POST("api/auth/register")
    Call<RegisterResponse> register(@Body RegisterRequest request);
    
    @GET("api/products")
    Call<List<Product>> getProducts();
    
    @POST("api/payment/create")
    Call<PaymentResponse> createPayment(@Body PaymentRequest request);
}
```

### 2. OAuth Integration

**Google Sign-In:**
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

**Facebook Login:**
```gradle
dependencies {
    implementation 'com.facebook.android:facebook-login:16.1.3'
}
```

### 3. Payment SDK Integration

**Midtrans Android SDK:**
```gradle
dependencies {
    implementation 'com.midtrans:uikit:2.0.0-SANDBOX'
}
```

## Deployment Guide

### Backend Deployment

**Option 1: Cloud Platform (Recommended)**
- **Heroku**: Easy deployment untuk Node.js/Python
- **Railway**: Modern alternative ke Heroku
- **Vercel**: Untuk Next.js API routes
- **AWS/GCP**: Scalable production deployment

**Option 2: VPS (DigitalOcean, Linode)**
- Full control
- Docker containers
- Nginx reverse proxy
- PM2 untuk process management

### Database Hosting
- **PostgreSQL**: Heroku Postgres, Supabase, AWS RDS
- **MongoDB**: MongoDB Atlas (free tier available)

### Required Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Authentication
JWT_SECRET=your-secret-key
JWT_EXPIRATION=7d

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-secret

# Email Service
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@yourapp.com

# Payment Gateways
MIDTRANS_SERVER_KEY=your-midtrans-key
MIDTRANS_CLIENT_KEY=your-midtrans-client-key
DANA_MERCHANT_ID=your-dana-merchant
GOPAY_API_KEY=your-gopay-key

# Spotify
SPOTIFY_CLIENT_ID=your-spotify-id
SPOTIFY_CLIENT_SECRET=your-spotify-secret

# App Config
API_BASE_URL=https://api.yourapp.com
FRONTEND_URL=https://yourapp.com
```

## Cost Estimation

### Monthly Costs (Startup/Small Scale)

1. **Backend Hosting**: $5-20/month
   - Railway: $5/month (starter)
   - Heroku: $7/month (basic)
   - VPS: $5-10/month

2. **Database**: $0-10/month
   - MongoDB Atlas: Free tier (512MB)
   - PostgreSQL: Free tier available

3. **Email Service**: $0-15/month
   - SendGrid: 100 emails/day free
   - Mailgun: 5000 emails/month free

4. **Payment Gateway**: Transaction fees only
   - Midtrans: ~2-3% per transaction
   - Dana/GoPay: Varies by agreement

5. **APIs**:
   - Spotify: Free (with limits)
   - Google OAuth: Free
   - Facebook Login: Free

**Total Estimated: $10-50/month** (scalable based on usage)

## Development Roadmap

### Phase 1: Backend Setup (2-3 weeks)
- [ ] Setup backend framework
- [ ] Database design dan migration
- [ ] Authentication API
- [ ] Email service integration

### Phase 2: Core Features (3-4 weeks)
- [ ] Product management API
- [ ] Payment gateway integration (satu provider dulu)
- [ ] User profile API
- [ ] Testing dan debugging

### Phase 3: Advanced Features (2-3 weeks)
- [ ] OAuth integration (Google, Facebook)
- [ ] Multiple payment providers
- [ ] Admin panel backend
- [ ] Analytics implementation

### Phase 4: Android Integration (2 weeks)
- [ ] Connect Android app ke backend
- [ ] Replace mock dengan real API calls
- [ ] Error handling dan loading states
- [ ] Testing end-to-end

### Phase 5: Production (1-2 weeks)
- [ ] Security audit
- [ ] Performance optimization
- [ ] Deployment ke production
- [ ] Monitoring setup

## Next Steps

1. **Pilih Tech Stack**: Tentukan Node.js vs Python, PostgreSQL vs MongoDB
2. **Setup Development Environment**: Install dependencies, setup local database
3. **Create Backend Repository**: Separate repo untuk backend
4. **Start with Authentication**: Implement register/login pertama
5. **Gradual Integration**: Connect satu fitur per waktu ke Android app

## Support & Resources

- **Backend Examples**: Check `/docs/backend-examples/` untuk sample code
- **API Documentation**: Will be generated with Swagger/OpenAPI
- **Testing**: Postman collection untuk API testing
- **CI/CD**: GitHub Actions untuk automated deployment

## Security Considerations

1. **HTTPS Only**: SSL certificate mandatory
2. **API Rate Limiting**: Prevent abuse
3. **Input Validation**: Sanitize all inputs
4. **Password Hashing**: bcrypt atau argon2
5. **JWT Security**: Short expiration, refresh tokens
6. **CORS**: Proper CORS configuration
7. **Environment Variables**: Never commit secrets
8. **SQL Injection**: Use parameterized queries
9. **XSS Prevention**: Sanitize outputs
10. **Regular Updates**: Keep dependencies updated

---

**Status**: UI Prototype Complete ✅  
**Next**: Backend Development Required  
**Maintainer**: Contact for backend setup assistance
