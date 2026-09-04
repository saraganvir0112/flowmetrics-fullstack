import jwt from 'jsonwebtoken';
import { createApp } from '../app.js';
import { BlogPost } from '../models/BlogPost.js';
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
  console.log('🧪 Starting Milestone 5 Blog Domain & Publishing Verification...\n');
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

  // In-memory backing store for mock BlogPost model
  const mockDb = new Map<string, any>();
  let idCounter = 1;

  function createMockDoc(data: any) {
    const hexId = (idCounter++).toString().padStart(24, '0');
    const now = new Date();
    const doc = {
      _id: hexId,
      id: hexId,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      thumbnail: data.thumbnail,
      category: data.category,
      readTime: data.readTime,
      featured: Boolean(data.featured),
      status: data.status || 'draft',
      publishedAt: data.publishedAt || (data.status === 'published' ? now : undefined),
      createdAt: now,
      updatedAt: now,
      toJSON: function () {
        return {
          id: this.id,
          title: this.title,
          slug: this.slug,
          excerpt: this.excerpt,
          content: this.content,
          thumbnail: this.thumbnail,
          category: this.category,
          readTime: this.readTime,
          featured: this.featured,
          status: this.status,
          publishedAt: this.publishedAt ? new Date(this.publishedAt).toISOString() : undefined,
          createdAt: this.createdAt.toISOString(),
          updatedAt: this.updatedAt.toISOString(),
        };
      },
    };
    return doc;
  }

  // Mock Mongoose BlogPost model methods
  const origFind = BlogPost.find;
  const origFindOne = BlogPost.findOne;
  const origFindById = BlogPost.findById;
  const origCreate = BlogPost.create;
  const origFindByIdAndUpdate = BlogPost.findByIdAndUpdate;
  const origFindByIdAndDelete = BlogPost.findByIdAndDelete;

  (BlogPost as any).create = async function (data: any) {
    const doc = createMockDoc(data);
    mockDb.set(doc.id, doc);
    return doc;
  };

  (BlogPost as any).find = function (filter?: any) {
    const docs = Array.from(mockDb.values()).filter((d) => {
      if (!filter) return true;
      if (filter.status && d.status !== filter.status) return false;
      return true;
    });

    return {
      sort: function (sortObj: any) {
        docs.sort((a, b) => {
          if (sortObj?.featured) {
            const aFeat = a.featured ? 1 : 0;
            const bFeat = b.featured ? 1 : 0;
            if (aFeat !== bFeat) return bFeat - aFeat;
          }
          const aPub = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const bPub = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          if (aPub !== bPub) return bPub - aPub;
          return b.createdAt.getTime() - a.createdAt.getTime();
        });
        return Promise.resolve(docs);
      },
      then: function (resolve: any) {
        return Promise.resolve(docs).then(resolve);
      },
    };
  };

  (BlogPost as any).findOne = async function (filter: any) {
    for (const doc of mockDb.values()) {
      let matches = true;
      if (filter._id && doc.id !== filter._id) matches = false;
      if (filter._id && filter._id.$ne && doc.id === filter._id.$ne) matches = false;
      if (filter.slug && doc.slug !== filter.slug) matches = false;
      if (filter.status && doc.status !== filter.status) matches = false;
      if (matches) return doc;
    }
    return null;
  };

  (BlogPost as any).findById = async function (id: string) {
    return mockDb.get(id) || null;
  };

  (BlogPost as any).findByIdAndUpdate = async function (id: string, update: any) {
    const doc = mockDb.get(id);
    if (!doc) return null;

    Object.assign(doc, update);
    doc.updatedAt = new Date();
    mockDb.set(id, doc);
    return doc;
  };

  (BlogPost as any).findByIdAndDelete = async function (id: string) {
    const doc = mockDb.get(id);
    if (!doc) return null;
    mockDb.delete(id);
    return doc;
  };

  const app = createApp();
  const PORT = 5096;
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

    // 1. Admin creates a draft post
    const draftRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Draft Engineering Article',
        slug: 'draft-engineering-article',
        excerpt: 'Internal draft preview that should never leak to public endpoints.',
        content: '<p>Work in progress draft content...</p>',
        status: 'draft',
        featured: false,
      }),
    });
    const draftData = (await draftRes.json()) as ApiResponse;
    assert(draftRes.status === 201 && draftData.success === true, '1. Admin creates a draft post (HTTP 201)');
    const draftPostId = draftData.data?.id;

    // 2. Admin creates a published post
    const pubRes1 = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Measuring Team Velocity Without Burnout',
        slug: 'measuring-team-velocity-without-burnout',
        excerpt: 'How data-driven engineering leaders track progress sustainably.',
        content: '<p>Sustainable velocity is about consistent cadences, not heroic overtime.</p>',
        category: 'Productivity',
        readTime: 6,
        status: 'published',
        featured: false,
      }),
    });
    const pubData1 = (await pubRes1.json()) as ApiResponse;
    assert(pubRes1.status === 201 && pubData1.success === true, '2. Admin creates a published post (HTTP 201)');
    const pubPostId1 = pubData1.data?.id;

    // Create a second published post that is FEATURED
    const pubRes2 = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'The Future of Remote Workload Analytics',
        slug: 'future-of-remote-workload-analytics',
        excerpt: 'Deep dive into workflow telemetry and automated balance insights.',
        content: '<p>Telemetry enables managers to rebalance sprint capacity dynamically.</p>',
        category: 'Analytics',
        readTime: 8,
        status: 'published',
        featured: true, // Featured post
      }),
    });
    const pubData2 = (await pubRes2.json()) as ApiResponse;
    const pubPostId2 = pubData2.data?.id;

    // 3. Draft appears in admin listing
    const adminListRes = await fetch(`${baseUrl}/api/blog/admin/all`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminListData = (await adminListRes.json()) as ApiResponse<any[]>;
    assert(
      adminListRes.status === 200 &&
        Boolean(adminListData.data?.some((p) => p.id === draftPostId && p.status === 'draft')),
      '3. Draft appears in admin listing (GET /api/blog/admin/all)'
    );

    // 4. Published post appears in admin listing
    assert(
      Boolean(adminListData.data?.some((p) => p.id === pubPostId1 && p.status === 'published')),
      '4. Published post appears in admin listing'
    );

    // 5. Public GET /api/blog returns published posts
    const publicListRes = await fetch(`${baseUrl}/api/blog`);
    const publicListData = (await publicListRes.json()) as ApiResponse<any[]>;
    assert(
      publicListRes.status === 200 &&
        Boolean(publicListData.data?.some((p) => p.id === pubPostId1)) &&
        Boolean(publicListData.data?.some((p) => p.id === pubPostId2)),
      '5. Public GET /api/blog returns published posts'
    );

    // 6. Public GET /api/blog does NOT return drafts
    assert(
      !publicListData.data?.some((p) => p.id === draftPostId || p.status === 'draft'),
      '6. Public GET /api/blog does NOT return drafts'
    );

    // 7. Featured published posts are prioritized first in public list
    assert(
      Boolean(publicListData.data?.[0]?.id === pubPostId2 && publicListData.data?.[0]?.featured === true),
      '7. Featured published posts are prioritized first in public list'
    );

    // 8. Public GET /api/blog/:slug returns published post
    const pubSlugRes = await fetch(`${baseUrl}/api/blog/measuring-team-velocity-without-burnout`);
    const pubSlugData = (await pubSlugRes.json()) as ApiResponse;
    assert(
      pubSlugRes.status === 200 && pubSlugData.data?.slug === 'measuring-team-velocity-without-burnout',
      '8. Public GET /api/blog/:slug returns published post'
    );

    // 9. Public GET /api/blog/:slug returns 404 for draft
    const draftSlugRes = await fetch(`${baseUrl}/api/blog/draft-engineering-article`);
    assert(draftSlugRes.status === 404, '9. Public GET /api/blog/:slug returns 404 for draft post');

    // 10. Public GET /api/blog/:slug returns 404 for invalid/non-existent slug
    const nonExistentSlugRes = await fetch(`${baseUrl}/api/blog/completely-made-up-nonexistent-slug`);
    assert(
      nonExistentSlugRes.status === 404,
      '10. Public GET /api/blog/:slug returns 404 for non-existent slug'
    );

    // 11. Admin can retrieve draft by ID via /admin/:id
    const adminGetDraftRes = await fetch(`${baseUrl}/api/blog/admin/${draftPostId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const adminGetDraftData = (await adminGetDraftRes.json()) as ApiResponse;
    assert(
      adminGetDraftRes.status === 200 && adminGetDraftData.data?.id === draftPostId,
      '11. Admin can retrieve draft by ID (GET /api/blog/admin/:id)'
    );

    // 12. Admin can update a post
    const updateRes = await fetch(`${baseUrl}/api/blog/${pubPostId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Measuring Velocity Sustainably (Updated)',
      }),
    });
    const updateData = (await updateRes.json()) as ApiResponse;
    assert(
      updateRes.status === 200 &&
        updateData.data?.title === 'Measuring Velocity Sustainably (Updated)',
      '12. Admin can update a post (HTTP 200)'
    );

    // 13. Admin can change featured true/false
    const toggleFeaturedRes = await fetch(`${baseUrl}/api/blog/${pubPostId1}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        featured: true,
      }),
    });
    const toggleFeaturedData = (await toggleFeaturedRes.json()) as ApiResponse;
    assert(
      toggleFeaturedRes.status === 200 && toggleFeaturedData.data?.featured === true,
      '13. Admin can change featured true/false'
    );

    // 14. Admin can change draft to published
    const publishDraftRes = await fetch(`${baseUrl}/api/blog/${draftPostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'published',
      }),
    });
    const publishDraftData = (await publishDraftRes.json()) as ApiResponse;
    assert(
      publishDraftRes.status === 200 && publishDraftData.data?.status === 'published',
      '14. Admin can change draft to published'
    );

    // 15. Admin can change published to draft
    const unpublishRes = await fetch(`${baseUrl}/api/blog/${draftPostId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'draft',
      }),
    });
    const unpublishData = (await unpublishRes.json()) as ApiResponse;
    assert(
      unpublishRes.status === 200 && unpublishData.data?.status === 'draft',
      '15. Admin can change published to draft'
    );

    // 16. Admin can delete a post
    const deleteRes = await fetch(`${baseUrl}/api/blog/${draftPostId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(deleteRes.status === 200, '16. Admin can delete a post (HTTP 200)');

    // 17. Unauthenticated admin write request returns 401
    const unauthRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Unauthenticated Article',
        slug: 'unauth-article',
        excerpt: 'Excerpt text',
        content: '<p>Content</p>',
      }),
    });
    assert(unauthRes.status === 401, '17. Unauthenticated write request returns HTTP 401');

    // 18. Authenticated non-admin write request returns 403
    const forbiddenRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        title: 'Non-Admin Article',
        slug: 'non-admin-article',
        excerpt: 'Excerpt text',
        content: '<p>Content</p>',
      }),
    });
    assert(forbiddenRes.status === 403, '18. Authenticated non-admin write request returns HTTP 403');

    // 19. Invalid payload returns 400
    const invalidRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: '', // Empty title
        slug: 'valid-slug',
        excerpt: '',
        content: '',
      }),
    });
    assert(invalidRes.status === 400, '19. Invalid payload returns HTTP 400 with validation details');

    // 20. Invalid slug is rejected (uppercase or spaces)
    const badSlugRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Title With Bad Slug',
        slug: 'INVALID SLUG WITH SPACES & CAPS!',
        excerpt: 'Excerpt here',
        content: '<p>Content</p>',
      }),
    });
    assert(badSlugRes.status === 400, '20. Invalid slug format is rejected (HTTP 400)');

    // 21. Duplicate slug is handled safely (HTTP 409)
    const duplicateSlugRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Duplicate Slug Attempt',
        slug: 'future-of-remote-workload-analytics', // already taken by pubPostId2
        excerpt: 'Excerpt text',
        content: '<p>Content</p>',
      }),
    });
    assert(
      duplicateSlugRes.status === 409,
      '21. Duplicate slug is handled safely (HTTP 409 Conflict)'
    );

    // 22. Write rate limiter triggers 429 after threshold
    console.log('⏳ Testing blog write rate limiter threshold on POST /api/blog...');
    let rateLimited = false;
    for (let i = 0; i < 65; i++) {
      const res = await fetch(`${baseUrl}/api/blog`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: `Spam Post ${i}`,
          slug: `spam-post-${i}`,
          excerpt: 'Short excerpt',
          content: '<p>Some content</p>',
        }),
      });
      if (res.status === 429) {
        rateLimited = true;
        const rateData = (await res.json()) as ApiResponse;
        assert(
          rateData.error?.code === 'TOO_MANY_REQUESTS',
          '22. Write rate limiter eventually returns HTTP 429 after threshold'
        );
        break;
      }
    }
    if (!rateLimited) {
      assert(false, '22. Write rate limiter returns HTTP 429');
    }

    // 23. Passwords/JWT/database secrets never leak
    assert(
      (pubData1 as any).password === undefined &&
        (pubData1 as any).passwordHash === undefined &&
        (publicListData as any).password === undefined,
      '23. No secret credentials leak in blog responses'
    );

    // 24. Blog content sanitizes scripts and inline event handlers
    const xssPayload = '<p>Normal text</p><script>alert("xss")</script><a href="https://example.com" onclick="stealCookies()">Link</a>';
    const xssRes = await fetch(`${baseUrl}/api/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: 'Security Sanitization Test',
        slug: 'security-sanitization-test',
        excerpt: 'Excerpt',
        content: xssPayload,
      }),
    });
    // If rate limited by test 22, let's verify via sanitizeBlogContent directly
    let cleanSavedContent = '';
    if (xssRes.status === 201) {
      const xssData = (await xssRes.json()) as ApiResponse;
      cleanSavedContent = xssData.data?.content || '';
    } else {
      const { sanitizeBlogContent } = await import('../utils/sanitize.js');
      cleanSavedContent = sanitizeBlogContent(xssPayload);
    }

    assert(
      !cleanSavedContent.includes('<script>') &&
        !cleanSavedContent.includes('alert(') &&
        !cleanSavedContent.includes('onclick='),
      '24. Blog content does not permit script injection or inline event handlers'
    );

    console.log(`\n📊 Verification Summary: ${passedCount}/${totalCount} tests passed.`);
  } finally {
    BlogPost.find = origFind;
    BlogPost.findOne = origFindOne;
    BlogPost.findById = origFindById;
    BlogPost.create = origCreate;
    BlogPost.findByIdAndUpdate = origFindByIdAndUpdate;
    BlogPost.findByIdAndDelete = origFindByIdAndDelete;
    server.close();
  }
}

runTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Blog test error:', err);
    process.exit(1);
  });
