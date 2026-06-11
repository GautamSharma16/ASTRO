import Hero from "../components/Hero";
import Problems from "../components/Problems";
import WhyVastu from "../components/WhyVastu";
import Benefits from "../components/Benefits";
import AboutExpert from "../components/AboutExpert";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import HomeCTA from "../components/HomeCTA";

export default function Home() {
  return (
    <div className="relative w-full">
      {/* Hero section */}
      <Hero />
      
      {/* Problem awareness section */}
      <Problems />
      
      {/* Why Astro Vastu works section */}
      <WhyVastu />
      
      {/* Benefits section */}
      <Benefits />
      
      {/* About expert section */}
      <AboutExpert />
      
      {/* Testimonials section */}
      <Testimonials />
      
      {/* FAQ section */}
      <FAQ />
      
      {/* Bottom CTA section */}
      <HomeCTA />
    </div>
  );
}
