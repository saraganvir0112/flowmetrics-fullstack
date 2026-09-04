import http from 'http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createApp } from '../app.js';
import { User } from '../models/User.js';
import { signToken, verifyToken } from '../utils/jwt.js';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

async function runTests() {
  console.log('🧪 Starting Milestone 3 Authentication & Authorization Verification...\n');
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, testName: string, extraInfo?: string) {
    totalCount++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passedCount++;
    } else {
      console.error(`❌ [FAIL] ${testName}${extraInfo ? ` - ${extraInfo}` : ''}`);
    }
  }

  // Generate real bcrypt hash for test admin
  const testPassword = 'AdminSecurePassword123!';
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  // Mock User.findOne to test service and controllers without external DB requirement
  const originalFindOne = User.findOne;
  (User as any).findOne = function (query: any) {
    const email = query.email;
    return {
      select: function () {
        if (email === 'admin@flowmetrics.dev') {
          return Promise.resolve({
            _id: '65e6a1234567890123456789',
            name: 'System Admin',
            email: 'admin@flowmetrics.dev',
            passwordHash: hashedPassword,
            role: 'admin',
            createdAt: new Date(),
            updatedAt: new Date(),
            comparePassword: (candidate: string) => bcrypt.compare(candidate, hashedPassword),
            toSafeJSON: function () {
              return {
                id: '65e6a1234567890123456789',
                name: 'System Admin',
                email: 'admin@flowmetrics.dev',
                role: 'admin',
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
              };
            },
          });
        }
        return Promise.resolve(null);
      },
    };
  };

  const app = createApp();
  const PORT = 5098;
  const server = app.listen(PORT);

  try {
    const baseUrl = `http://localhost:${PORT}`;

    // Test 1: Successful admin login
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@flowmetrics.dev',
        password: testPassword,
      }),
    });
    const loginData = (await loginRes.json()) as ApiResponse;
    assert(loginRes.status === 200 && loginData.success === true, '1. Successful admin login returns HTTP 200');

    const adminToken = loginData.data?.token;
    assert(typeof adminToken === 'string' && adminToken.length > 20, '2. Login returns a valid JWT string');

    // Test 3: Password hash is NOT returned in API response
    assert(
      loginData.data?.user?.passwordHash === undefined && (loginData.data as any)?.passwordHash === undefined,
      '3. Password hash is never returned by the API'
    );

    // Test 4: JWT does not contain password or hash
    const decodedJwt = jwt.decode(adminToken) as any;
    assert(
      decodedJwt?.password === undefined &&
        decodedJwt?.passwordHash === undefined &&
        decodedJwt?.role === 'admin' &&
        decodedJwt?.email === 'admin@flowmetrics.dev',
      '4. JWT payload contains only safe data (userId, email, role) and NO password data'
    );

    // Test 5: Invalid password returns 401 with generic error
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@flowmetrics.dev',
        password: 'IncorrectPassword999!',
      }),
    });
    const wrongPassData = (await wrongPassRes.json()) as ApiResponse;
    assert(
      wrongPassRes.status === 401 && wrongPassData.error?.message === 'Invalid email or password',
      '5. Invalid password returns HTTP 401 with generic error message'
    );

    // Test 6: Non-existent email returns 401 with identical generic error
    const wrongEmailRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'unknown@flowmetrics.dev',
        password: testPassword,
      }),
    });
    const wrongEmailData = (await wrongEmailRes.json()) as ApiResponse;
    assert(
      wrongEmailRes.status === 401 && wrongEmailData.error?.message === 'Invalid email or password',
      '6. Non-existent email returns HTTP 401 with identical generic error message'
    );

    // Test 7: Missing Authorization header on protected route returns 401
    const noTokenRes = await fetch(`${baseUrl}/api/auth/me`);
    const noTokenData = (await noTokenRes.json()) as ApiResponse;
    assert(
      noTokenRes.status === 401 && noTokenData.error?.code === 'UNAUTHORIZED',
      '7. Missing Authorization token returns HTTP 401'
    );

    // Test 8: Invalid / malformed token returns 401
    const badTokenRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: 'Bearer this.is.not.a.valid.jwt.signature' },
    });
    const badTokenData = (await badTokenRes.json()) as ApiResponse;
    assert(
      badTokenRes.status === 401 && badTokenData.error?.code === 'INVALID_TOKEN',
      '8. Invalid token returns HTTP 401'
    );

    // Test 9: Authenticated non-admin user returns 403 on admin-protected route
    const regularUserToken = signToken({
      userId: '65e6a9999999999999999999',
      email: 'user@flowmetrics.dev',
      role: 'user',
    });
    const forbiddenRes = await fetch(`${baseUrl}/api/auth/admin-test`, {
      headers: { Authorization: `Bearer ${regularUserToken}` },
    });
    const forbiddenData = (await forbiddenRes.json()) as ApiResponse;
    assert(
      forbiddenRes.status === 403 && forbiddenData.error?.code === 'FORBIDDEN',
      '9. Authenticated non-admin user returns HTTP 403 on admin-protected route'
    );

    // Test 10: Admin user passes the role middleware on admin-protected route
    const adminAllowedRes = await fetch(`${baseUrl}/api/auth/admin-test`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminAllowedData = (await adminAllowedRes.json()) as ApiResponse;
    assert(
      adminAllowedRes.status === 200 && adminAllowedData.data?.user?.role === 'admin',
      '10. Admin user passes the role middleware (HTTP 200)'
    );

    // Test 11: Rate limiting triggers HTTP 429 when threshold is exceeded
    console.log('⏳ Testing rate limiter threshold on login endpoint...');
    let rateLimited = false;
    for (let i = 0; i < 15; i++) {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'spam@flowmetrics.dev', password: 'password123' }),
      });
      if (res.status === 429) {
        rateLimited = true;
        const rateData = (await res.json()) as ApiResponse;
        assert(
          rateData.error?.code === 'TOO_MANY_REQUESTS',
          '11. Login rate limiter returns HTTP 429 after threshold is exceeded'
        );
        break;
      }
    }
    if (!rateLimited) {
      assert(false, '11. Login rate limiter returns HTTP 429 after threshold');
    }

    console.log(`\n📊 Verification Summary: ${passedCount}/${totalCount} tests passed.`);
  } finally {
    // Restore original method
    User.findOne = originalFindOne;
    server.close();
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test execution error:', err);
    process.exit(1);
  });
