import Companies from "@/components/companies";
import Feature from "@/components/feature";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Stats from "@/components/stats";
import ToolFeature from "@/components/tools";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <section className="px-4 pb-16 pt-32 lg:pb-24">
        <Hero />
      </section>
      <section className="px-4 py-16 lg:py-24">
        <Companies />
      </section>
      <section className="px-4 py-16 lg:py-24">
        <Feature />
      </section>
      <section className="px-4 py-16 lg:py-24">
        <Stats />
      </section>
      <section className="px-4 py-16 lg:py-24">
        <ToolFeature />
      </section>
      <section className="px-4 py-16 lg:py-24">
        <Pricing />
      </section>
      <footer className="px-4 py-12">
        <Footer />
      </footer>
    </main>
  );
}
