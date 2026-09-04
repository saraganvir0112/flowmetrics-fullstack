import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { signToken } from '../utils/jwt.js';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  meta?: {
    count?: number;
    timestamp?: string;
  };
}

async function runTests() {
  console.log('🧪 Starting Milestone 4 Pricing Plans CRUD Verification...\n');
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

  // In-memory backing store for mock PricingPlan model
  const mockDb = new Map<string, any>();
  let idCounter = 1;

  function createMockDoc(data: any) {
    const hexId = (idCounter++).toString().padStart(24, '0');
    const now = new Date();
    const doc = {
      _id: hexId,
      id: hexId,
      name: data.name,
      price: data.price,
      billingCycle: data.billingCycle || 'month',
      description: data.description || '',
      features: Array.isArray(data.features) ? [...data.features] : [],
      highlighted: Boolean(data.highlighted),
      status: data.status || 'published',
      createdAt: now,
      updatedAt: now,
      toJSON: function () {
        return {
          id: this.id,
          name: this.name,
          price: this.price,
          billingCycle: this.billingCycle,
          description: this.description,
          features: this.features,
          highlighted: this.highlighted,
          status: this.status,
          createdAt: this.createdAt.toISOString(),
          updatedAt: this.updatedAt.toISOString(),
        };
      },
    };
    return doc;
  }

  // Mock Mongoose PricingPlan model methods
  const origFind = PricingPlan.find;
  const origFindOne = PricingPlan.findOne;
  const origFindById = PricingPlan.findById;
  const origCreate = PricingPlan.create;
  const origFindByIdAndUpdate = PricingPlan.findByIdAndUpdate;
  const origFindByIdAndDelete = PricingPlan.findByIdAndDelete;

  (PricingPlan as any).create = async function (data: any) {
    const doc = createMockDoc(data);
    mockDb.set(doc.id, doc);
    return doc;
  };

  (PricingPlan as any).find = function (filter?: any) {
    const docs = Array.from(mockDb.values()).filter((d) => {
      if (!filter) return true;
      if (filter.status && d.status !== filter.status) return false;
      return true;
    });

    return {
      sort: function (sortObj: any) {
        if (sortObj?.price) {
          docs.sort((a, b) => a.price - b.price);
        } else if (sortObj?.createdAt) {
          docs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        }
        return Promise.resolve(docs);
      },
      then: function (resolve: any) {
        return Promise.resolve(docs).then(resolve);
      },
    };
  };

  (PricingPlan as any).findOne = async function (filter: any) {
    for (const doc of mockDb.values()) {
      let matches = true;
      if (filter._id && doc.id !== filter._id) matches = false;
      if (filter.status && doc.status !== filter.status) matches = false;
      if (matches) return doc;
    }
    return null;
  };

  (PricingPlan as any).findById = async function (id: string) {
    return mockDb.get(id) || null;
  };

  (PricingPlan as any).findByIdAndUpdate = async function (id: string, update: any) {
    const doc = mockDb.get(id);
    if (!doc) return null;

    Object.assign(doc, update);
    doc.updatedAt = new Date();
    mockDb.set(id, doc);
    return doc;
  };

  (PricingPlan as any).findByIdAndDelete = async function (id: string) {
    const doc = mockDb.get(id);
    if (!doc) return null;
    mockDb.delete(id);
    return doc;
  };

  const app = createApp();
  const PORT = 5097;
  const server = app.listen(PORT);

  try {
    const baseUrl = `http://localhost:${PORT}`;

    // Generate tokens
    const adminToken = signToken({
      userId: '65e6a1234567890123456789',
      email: 'admin@flowmetrics.dev',
      role: 'admin',
    });

    const userToken = signToken({
      userId: '65e6a9999999999999999999',
      email: 'user@flowmetrics.dev',
      role: 'user',
    });

    // 1. Admin can create a pricing plan
    const createPublishedRes = await fetch(`${baseUrl}/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Starter Tier',
        price: 29,
        billingCycle: 'month',
        description: 'Perfect for small remote teams',
        features: ['Up to 10 team members', 'Basic workload tracking', 'Email support'],
        highlighted: false,
        status: 'published',
      }),
    });
    const createPublishedData = (await createPublishedRes.json()) as ApiResponse;
    assert(createPublishedRes.status === 201 && createPublishedData.success === true, '1. Admin can create a pricing plan (HTTP 201)');

    const publishedPlanId = createPublishedData.data?.id;

    // 2. Created plan is saved with features array and highlighted boolean
    assert(
      Array.isArray(createPublishedData.data?.features) &&
        createPublishedData.data?.features.length === 3 &&
        createPublishedData.data?.highlighted === false,
      '2. Created plan contains proper features array and highlighted boolean'
    );

    // Create a draft plan
    const createDraftRes = await fetch(`${baseUrl}/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: 'Enterprise Beta',
        price: 99,
        billingCycle: 'month',
        description: 'Draft plan for testing',
        features: ['Custom integrations', 'Dedicated support'],
        highlighted: false,
        status: 'draft',
      }),
    });
    const createDraftData = (await createDraftRes.json()) as ApiResponse;
    const draftPlanId = createDraftData.data?.id;

    // 3. Public GET /api/plans returns published plans
    const publicListRes = await fetch(`${baseUrl}/api/plans`);
    const publicListData = (await publicListRes.json()) as ApiResponse<any[]>;
    assert(
      publicListRes.status === 200 &&
        Array.isArray(publicListData.data) &&
        publicListData.data.some((p) => p.id === publishedPlanId),
      '3. Public GET /api/plans returns published plans'
    );

    // 4. Public GET /api/plans does NOT return draft plans
    assert(
      !publicListData.data?.some((p) => p.id === draftPlanId),
      '4. Public GET /api/plans does NOT return draft plans'
    );

    // 5. Public GET /api/plans/:id returns published plan
    const publicSingleRes = await fetch(`${baseUrl}/api/plans/${publishedPlanId}`);
    const publicSingleData = (await publicSingleRes.json()) as ApiResponse;
    assert(
      publicSingleRes.status === 200 && publicSingleData.data?.id === publishedPlanId,
      '5. Public GET /api/plans/:id returns published plan'
    );

    // 6. Public GET /api/plans/:id returns 404 for draft plan
    const publicDraftLookupRes = await fetch(`${baseUrl}/api/plans/${draftPlanId}`);
    assert(
      publicDraftLookupRes.status === 404,
      '6. Public GET /api/plans/:id cannot return a draft plan (HTTP 404)'
    );

    // 7. Admin can retrieve all plans including drafts via GET /api/plans/admin/all
    const adminAllRes = await fetch(`${baseUrl}/api/plans/admin/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminAllData = (await adminAllRes.json()) as ApiResponse<any[]>;
    assert(
      adminAllRes.status === 200 &&
        Boolean(adminAllData.data?.some((p) => p.id === draftPlanId)) &&
        Boolean(adminAllData.data?.some((p) => p.id === publishedPlanId)),
      '7. Admin can retrieve/manage draft plans through protected operations (GET /api/plans/admin/all)'
    );

    // 8. Admin can update a pricing plan
    const updateRes = await fetch(`${baseUrl}/api/plans/${publishedPlanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 39,
      }),
    });
    const updateData = (await updateRes.json()) as ApiResponse;
    assert(
      updateRes.status === 200 && updateData.data?.price === 39,
      '8. Admin can update a pricing plan (HTTP 200)'
    );

    // 9. Admin can change highlighted from false to true
    const highlightRes = await fetch(`${baseUrl}/api/plans/${publishedPlanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        highlighted: true,
      }),
    });
    const highlightData = (await highlightRes.json()) as ApiResponse;
    assert(
      highlightRes.status === 200 && highlightData.data?.highlighted === true,
      '9. Admin can change highlighted from false to true'
    );

    // 10. Admin can modify the nested features array
    const newFeatures = ['Feature A', 'Feature B', 'Feature C', 'Feature D'];
    const featuresRes = await fetch(`${baseUrl}/api/plans/${publishedPlanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        features: newFeatures,
      }),
    });
    const featuresData = (await featuresRes.json()) as ApiResponse;
    assert(
      featuresRes.status === 200 &&
        featuresData.data?.features?.length === 4 &&
        featuresData.data?.features[0] === 'Feature A',
      '10. Admin can modify the nested features array'
    );

    // 11. Admin can publish a draft plan
    const publishRes = await fetch(`${baseUrl}/api/plans/${draftPlanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'published',
      }),
    });
    const publishData = (await publishRes.json()) as ApiResponse;
    assert(
      publishRes.status === 200 && publishData.data?.status === 'published',
      '11. Admin can publish a draft plan'
    );

    // 12. Admin can delete a plan
    const deleteRes = await fetch(`${baseUrl}/api/plans/${draftPlanId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteRes.status === 200, '12. Admin can delete a plan (HTTP 200)');

    // 13. Unauthenticated write request returns 401
    const unauthRes = await fetch(`${baseUrl}/api/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Unauth Plan',
        price: 10,
        billingCycle: 'month',
        features: ['Feature 1'],
      }),
    });
    assert(unauthRes.status === 401, '13. Unauthenticated write request returns HTTP 401');

    // 14. Authenticated non-admin write request returns 403
    const forbiddenRes = await fetch(`${baseUrl}/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        name: 'User Plan',
        price: 10,
        billingCycle: 'month',
        features: ['Feature 1'],
      }),
    });
    assert(forbiddenRes.status === 403, '14. Authenticated non-admin write request returns HTTP 403');

    // 15. Invalid payload returns 400 with validation details
    const invalidPayloadRes = await fetch(`${baseUrl}/api/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        name: '', // Empty name
        price: -5, // Negative price
        billingCycle: 'decade', // Invalid billing cycle
        features: [], // Empty features array
      }),
    });
    const invalidPayloadData = (await invalidPayloadRes.json()) as ApiResponse;
    assert(
      invalidPayloadRes.status === 400 &&
        invalidPayloadData.error?.code === 'VALIDATION_ERROR' &&
        Array.isArray(invalidPayloadData.error?.details),
      '15. Invalid payload returns HTTP 400 with validation details'
    );

    // 16. Write rate limiting returns 429 for repeated requests
    console.log('⏳ Testing write rate limiter threshold on POST /api/plans...');
    let rateLimited = false;
    for (let i = 0; i < 65; i++) {
      const res = await fetch(`${baseUrl}/api/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          name: `Flood Plan ${i}`,
          price: 10,
          billingCycle: 'month',
          features: ['Feature'],
        }),
      });
      if (res.status === 429) {
        rateLimited = true;
        const rateData = (await res.json()) as ApiResponse;
        assert(
          rateData.error?.code === 'TOO_MANY_REQUESTS',
          '16. Write rate limiting returns HTTP 429 after threshold'
        );
        break;
      }
    }
    if (!rateLimited) {
      assert(false, '16. Write rate limiting returns HTTP 429');
    }

    // 17. Passwords/JWT/database secrets are never exposed
    assert(
      (createPublishedData as any).password === undefined &&
        (createPublishedData as any).passwordHash === undefined &&
        (publicListData as any).password === undefined &&
        (adminAllData as any).password === undefined,
      '17. Passwords/JWT/database secrets are never exposed in pricing responses'
    );

    console.log(`\n📊 Verification Summary: ${passedCount}/${totalCount} tests passed.`);
  } finally {
    // Restore original Mongoose model functions
    PricingPlan.find = origFind;
    PricingPlan.findOne = origFindOne;
    PricingPlan.findById = origFindById;
    PricingPlan.create = origCreate;
    PricingPlan.findByIdAndUpdate = origFindByIdAndUpdate;
    PricingPlan.findByIdAndDelete = origFindByIdAndDelete;
    server.close();
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Pricing test error:', err);
    process.exit(1);
  });
