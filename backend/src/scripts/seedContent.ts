import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { PricingPlan } from '../models/PricingPlan.js';
import { BlogPost } from '../models/BlogPost.js';
import { sanitizeBlogContent } from '../utils/sanitize.js';

/**
 * Optional Standalone Demo Content Seeder.
 * Populates sample published Pricing Plans and Blog Posts in MongoDB
 * if the database is currently empty.
 *
 * NOTE: This is an explicit manual CLI utility and is NEVER executed
 * automatically on application startup.
 */
export async function seedContent(): Promise<void> {
  try {
    console.log('🌱 Checking MongoDB Atlas for sample marketing content...');
    await connectDatabase();

    // 1. Seed Pricing Plans if none exist
    const planCount = await PricingPlan.countDocuments();
    if (planCount === 0) {
      console.log('📦 Seeding sample published Pricing Plans...');
      await PricingPlan.create([
        {
          name: 'Starter',
          price: 29,
          billingCycle: 'month',
          description: 'Essential telemetry and workload visibility for small remote teams.',
          features: [
            'Up to 10 active team members',
            'Automated Git & Jira time mapping',
            'Weekly asynchronous sprint digests',
            'Core velocity & focus time charts',
            'Community & Slack support',
          ],
          highlighted: false,
          status: 'published',
        },
        {
          name: 'Growth',
          price: 79,
          billingCycle: 'month',
          description: 'Comprehensive workload intelligence and burnout alerts for fast-growing squads.',
          features: [
            'Up to 50 active team members',
            'Proactive workload & burnout alerts',
            'PR turnaround & bottleneck tracking',
            'Custom sprint velocity metrics',
            'Slack bot notifications & digests',
            'Priority technical support',
          ],
          highlighted: true, // Marked highlighted for dynamic badge rendering
          status: 'published',
        },
        {
          name: 'Enterprise',
          price: 199,
          billingCycle: 'month',
          description: 'Advanced governance, custom integrations, and dedicated telemetry pipelines.',
          features: [
            'Unlimited team members & pods',
            'Multi-organization workspace federation',
            'Raw telemetry export & Webhooks API',
            'Custom OKR & milestone mapping',
            'SSO & SAML 2.0 authentication',
            'Dedicated success engineer & SLA',
          ],
          highlighted: false,
          status: 'published',
        },
      ]);
      console.log('✅ 3 published Pricing Plans seeded successfully.');
    } else {
      console.log(`ℹ️ ${planCount} pricing plans already exist in database.`);
    }

    // 2. Seed Blog Posts if none exist
    const postCount = await BlogPost.countDocuments();
    if (postCount === 0) {
      console.log('📝 Seeding sample published Blog Posts...');
      const now = new Date();

      await BlogPost.create([
        {
          title: 'Scaling Distributed Engineering: Why Surveillance Fails and Telemetry Wins',
          slug: 'scaling-distributed-engineering-telemetry',
          excerpt:
            'How high-performing remote teams measure velocity and protect deep-work focus without intrusive monitoring.',
          content: sanitizeBlogContent(`
            <h2>The False Promise of Activity Monitoring</h2>
            <p>When engineering organizations transition from co-located offices to remote and hybrid schedules, management frequently defaults to visibility anxiety. The temptation is to track keystrokes, monitor active windows, or demand exhaustive daily timesheets.</p>
            <p>Empirical evidence consistently shows this destroys trust, drives away senior talent, and rewards performative busywork rather than impactful engineering deliverables.</p>
            <h2>Objective Telemetry vs. Keystroke Logging</h2>
            <p>Modern engineering telemetry operates on passive aggregation across existing development tools:</p>
            <ul>
              <li><strong>Pull Request Cycle Times:</strong> Identifying when code waits in review queues rather than active development.</li>
              <li><strong>Focus Block Preservation:</strong> Measuring uninterrupted hours available for deep architectural work.</li>
              <li><strong>Workload Distribution:</strong> Proactively catching when 20% of the team handles 80% of critical reviews.</li>
            </ul>
            <h2>Building a Culture of Sustainable Velocity</h2>
            <p>When telemetry is transparently accessible to engineers themselves rather than used as a punitive scorecard, teams naturally self-correct bottlenecks and celebrate real progress.</p>
          `),
          category: 'Engineering Culture',
          readTime: 5,
          featured: true,
          status: 'published',
          publishedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Eliminating the 5-Hour Status Meeting: The Power of Async Telemetry Digests',
          slug: 'eliminating-status-meetings-async-digests',
          excerpt:
            'Replace redundant weekly synchronization calls with automated commit telemetry and async sprint digests.',
          content: sanitizeBlogContent(`
            <h2>The Synchronous Tax on Distributed Teams</h2>
            <p>In distributed companies spanning multiple continents, finding a single 60-minute window where all engineers are awake and alert is nearly impossible. More often than not, it forces engineers into late evenings or early mornings just to recite status updates that are already recorded in git history.</p>
            <h2>Automating the Standup Without the Noise</h2>
            <p>By summarizing merged code, open review requests, and milestone pacing into an automated Monday morning digest, leadership receives clearer signal while engineers gain back hours of uninterrupted focus.</p>
          `),
          category: 'Remote Work',
          readTime: 4,
          featured: true,
          status: 'published',
          publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        },
        {
          title: 'Understanding PR Cycle Times: The True Bottleneck in Sprint Pacing',
          slug: 'understanding-pr-cycle-times-bottlenecks',
          excerpt:
            'A practical guide to analyzing review turnaround, comment volume, and unblocking deployment velocity.',
          content: sanitizeBlogContent(`
            <h2>Where Do Pull Requests Actually Wait?</h2>
            <p>When sprint commitments slip, teams often assume feature development took longer than anticipated. In reality, telemetry shows that up to 60% of a feature lifecycle is spent in passive review waiting state.</p>
            <h2>Healthy Review Benchmarks</h2>
            <p>Top decile engineering teams maintain average PR review times under 4 hours by keeping PR scopes small (under 250 lines) and balancing reviewer assignments dynamically across squads.</p>
          `),
          category: 'Productivity Metrics',
          readTime: 6,
          featured: false,
          status: 'published',
          publishedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        },
      ]);
      console.log('✅ 3 published Blog Posts seeded successfully.');
    } else {
      console.log(`ℹ️ ${postCount} blog posts already exist in database.`);
    }

    console.log('🌱 Content check completed.');
  } catch (error) {
    console.warn(
      '⚠️ MongoDB connection not available or unreachable:',
      error instanceof Error ? error.message : error
    );
    console.warn(
      'ℹ️ To seed demo content into MongoDB Atlas, update MONGODB_URI in backend/.env and re-run npm run seed:content.'
    );
  } finally {
    await disconnectDatabase();
  }
}

// Execute directly if run via CLI
seedContent()
  .then(() => process.exit(0))
  .catch(() => process.exit(0));
