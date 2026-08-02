import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wine, Beer, Martini, Coffee } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 lg:py-48 bg-black flex items-center justify-center overflow-hidden">
        {/* Placeholder for a cool background image/gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/40 z-0"></div>
        <div className="absolute inset-0 bg-black/60 z-0"></div>
        
        <div className="container px-4 md:px-6 relative z-10 text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
            Premium Alcohol & Snacks <br className="hidden md:block"/> 
            <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">
              Delivered in Minutes
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
            Your favorite drinks, mixers, and party snacks arriving right at your doorstep. Fast, reliable, and compliant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto font-bold text-lg px-8 py-6 rounded-full">
                Shop Now
              </Button>
            </Link>
            <Link href="/products?category=PARTY_PACKS">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                Explore Party Packs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="w-full py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Shop by Category</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Curated selections for every occasion.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard title="Whiskey & Spirits" icon={<Wine className="h-10 w-10 mb-4 text-primary" />} link="/products?category=WHISKEY" />
            <CategoryCard title="Beer & Cider" icon={<Beer className="h-10 w-10 mb-4 text-primary" />} link="/products?category=BEER" />
            <CategoryCard title="Wine & Champagne" icon={<Martini className="h-10 w-10 mb-4 text-primary" />} link="/products?category=WINE" />
            <CategoryCard title="Mixers & Snacks" icon={<Coffee className="h-10 w-10 mb-4 text-primary" />} link="/products?category=SNACKS" />
          </div>
        </div>
      </section>
      
      {/* AI Feature Highlight */}
      <section className="w-full py-16 md:py-24 bg-secondary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 px-10 md:gap-16 lg:grid-cols-2 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm text-primary font-medium">
                Powered by AI
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Not sure what to drink?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Try our AI Cocktail Generator. Tell us what ingredients you have, and we'll craft the perfect recipe and let you order the missing bottles instantly.
              </p>
              <Button className="mt-4" variant="secondary">
                Try AI Bartender
              </Button>
            </div>
            <div className="mx-auto flex w-full max-w-[400px] items-center justify-center">
              {/* Placeholder for UI mockup image */}
              <div className="w-full aspect-square bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                <span className="text-muted-foreground">AI Cocktail UI Mockup</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ title, icon, link }: { title: string, icon: React.ReactNode, link: string }) {
  return (
    <Link href={link}>
      <Card className="h-full hover:border-primary transition-colors cursor-pointer group bg-card/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center h-48">
          <div className="transform transition-transform group-hover:scale-110">
            {icon}
          </div>
          <h3 className="font-semibold text-lg">{title}</h3>
        </CardContent>
      </Card>
    </Link>
  );
}
