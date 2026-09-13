import Link from 'next/link';
import { Globe, MessageCircle, Share2, Video, Wine, MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  categories: [
    { name: 'Whiskey & Scotch', href: '/products?category=WHISKEY' },
    { name: 'Vodka', href: '/products?category=VODKA' },
    { name: 'Beer & Craft Beer', href: '/products?category=BEER' },
    { name: 'Wine & Champagne', href: '/products?category=WINE' },
    { name: 'Gin & Tonic', href: '/products?category=GIN' },
    { name: 'Rum', href: '/products?category=RUM' },
    { name: 'Mixers & Snacks', href: '/products?category=MIXERS' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Partner With Us', href: '/partner' },
    { name: 'Become a Delivery Partner', href: '/delivery-partner' },
    { name: 'Contact Support', href: '/contact' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Refund Policy', href: '/refund' },
    { name: 'Age & Compliance', href: '/compliance' },
    { name: 'Responsible Drinking', href: '/responsible-drinking' },
  ],
};

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white">
      {/* Newsletter Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold">Stay updated with the best deals</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get exclusive offers and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-lg font-bold text-white">D</span>
              </div>
              <span className="text-xl font-bold">
                Drink<span className="text-primary">It</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Premium alcohol, craft beverages, and snacks delivered to your doorstep in minutes. Fast, reliable, and fully compliant.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Share"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Message"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Globe"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors"
                aria-label="Video"
              >
                <Video className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Categories
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.categories.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Company
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h4>
            <nav className="flex flex-col gap-2.5">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} DrinkIt Technologies Pvt. Ltd. All rights reserved.
            </p>
            <p className="text-xs text-center text-muted-foreground font-medium bg-amber-50 text-amber-700 px-3 py-1 rounded-md">
              ⚠️ WARNING: Drinking alcohol is injurious to health. Only for persons above 21 years of age.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
