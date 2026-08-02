import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-12">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-4 md:grid-cols-4">
        
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold text-primary">DrinkIt</span>
          <p className="text-sm text-muted-foreground">
            Premium alcohol and snacks delivered to your door in minutes. 
            Enjoy responsibly.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Categories</h3>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/products?category=WHISKEY" className="hover:text-primary">Whiskey & Scotch</Link>
            <Link href="/products?category=VODKA" className="hover:text-primary">Vodka</Link>
            <Link href="/products?category=BEER" className="hover:text-primary">Beer & Cider</Link>
            <Link href="/products?category=WINE" className="hover:text-primary">Wines</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Company</h3>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/careers" className="hover:text-primary">Careers</Link>
            <Link href="/delivery-partner" className="hover:text-primary">Become a Delivery Partner</Link>
            <Link href="/contact" className="hover:text-primary">Contact Support</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-semibold">Legal</h3>
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/compliance" className="hover:text-primary">Age & Compliance</Link>
          </nav>
        </div>
        
      </div>
      <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DrinkIt Technologies. All rights reserved.</p>
        <p className="mt-2 text-xs">WARNING: Drinking alcohol is injurious to health. Only for users 21+.</p>
      </div>
    </footer>
  );
}
