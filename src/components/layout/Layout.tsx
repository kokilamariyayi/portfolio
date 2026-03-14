import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AnalyticsBackground } from '@/components/AnalyticsBackground';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <>
    {/* Full-screen data analytics workspace background */}
    <div className="fixed inset-0 -z-20">
      <AnalyticsBackground />
    </div>

    {/* Gradient mesh overlay for depth */}
    <div className="fixed inset-0 -z-10 bg-gradient-mesh pointer-events-none" aria-hidden="true" />

    <div className="min-h-screen flex flex-col relative z-0">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </>
);
