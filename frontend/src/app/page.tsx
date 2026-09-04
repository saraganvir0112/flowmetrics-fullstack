import { Navbar } from '@/components/navigation/Navbar';
import { Hero } from '@/components/hero/Hero';
import { TrustStrip } from '@/components/trust/TrustStrip';
import { Features } from '@/components/features/Features';
import { AnalyticsShowcase } from '@/components/analytics/AnalyticsShowcase';
import { PricingSection } from '@/components/pricing/PricingSection';
import { Testimonials } from '@/components/testimonials/Testimonials';
import { BlogSection } from '@/components/blog/BlogSection';
import { FinalCTA } from '@/components/cta/FinalCTA';
import { Footer } from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <Features />
        <AnalyticsShowcase />
        <PricingSection />
        <Testimonials />
        <BlogSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
