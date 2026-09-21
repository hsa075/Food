import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0',
  jwtSecret: process.env.JWT_SECRET || 'uttara_dev_jwt_secret_secure_key_1234567890',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'uttara_dev_refresh_secret_secure_key_0987654321',
  razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_uttara_demo_123',
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_uttara_456',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',
};
