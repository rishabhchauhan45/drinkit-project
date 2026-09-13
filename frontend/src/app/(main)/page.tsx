import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import TrendingSection from '@/components/home/TrendingSection';
import DealsSection from '@/components/home/DealsSection';
import BrandsSection from '@/components/home/BrandsSection';
import PremiumSection from '@/components/home/PremiumSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <TrendingSection />
      <DealsSection />
      <BrandsSection />
      <PremiumSection />
      <TestimonialsSection />
    </>
  );
}
