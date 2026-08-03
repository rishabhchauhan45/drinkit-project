import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import MobileMenu from '@/components/layout/MobileMenu';
import SearchModal from '@/components/layout/SearchModal';
import AgeVerificationModal from '@/components/home/AgeVerificationModal';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      
      {/* Global Overlays */}
      <CartDrawer />
      <MobileMenu />
      <SearchModal />
      <AgeVerificationModal />
    </div>
  );
}
