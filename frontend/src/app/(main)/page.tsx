import HeroSection from '@/components/home/HeroSection';
import CategorySection from '@/components/home/CategorySection';
import ProductRow from '@/components/home/ProductRow';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      
      <ProductRow 
        title="Trending Near You" 
        subtitle="Fast moving premium drinks" 
        href="/products?sort=popular" 
        filters={{ limit: 10, sort: 'popular' }} 
      />
      
      <ProductRow 
        title="Premium Collection" 
        subtitle="The finest selection above ₹1500" 
        href="/products?minPrice=1500" 
        filters={{ limit: 10, minPrice: 1500 }} 
      />
      
      <ProductRow 
        title="Stock Up on Beers" 
        subtitle="Perfect for the weekend" 
        href="/products?category=BEER" 
        filters={{ limit: 10, category: 'BEER' }} 
      />
    </>
  );
}
