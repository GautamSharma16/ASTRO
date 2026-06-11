import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import AstroLogo from "../assets/Astro_logo.webp";

export default function Footer() {
  const handleNavClick = (sectionId: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-white border-t border-gold-subtle/50 py-16 relative overflow-hidden">
      {/* Background Subtle Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold-50/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-50/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center">
              <img
                src={AstroLogo}
                alt="Astro Vastu Logo"
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gold-900/70 max-w-sm font-light leading-relaxed">
              Bridging the ancient wisdom of Vedic Astrology and Vastu Shastra to restore flow, balance, and Venusian abundance in your professional and personal life.
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-gold-900 uppercase tracking-widest mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleNavClick("problems")}
                  className="text-gold-900/60 hover:text-gold-500 transition-colors text-left"
                >
                  Challenges Addressed
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("why-vastu")}
                  className="text-gold-900/60 hover:text-gold-500 transition-colors text-left"
                >
                  Scientific Approach
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("expert")}
                  className="text-gold-900/60 hover:text-gold-500 transition-colors text-left"
                >
                  Meet The Expert
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick("faq")}
                  className="text-gold-900/60 hover:text-gold-500 transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="font-serif text-sm font-semibold text-gold-900 uppercase tracking-widest mb-4">
              Connect
            </h3>
            <ul className="space-y-3 text-sm text-gold-900/70">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span className="truncate">consult@energyacharya-shilpa.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                <span>Venus Enclave, Mumbai, India</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="gold-divider my-10" />

        {/* Disclaimer & Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[11px] text-gold-900/50">
          <p className="max-w-2xl text-center md:text-left leading-relaxed font-light">
            Disclaimer: Astro Vastu consultations are spiritual guidance practices based on cosmic charts and environmental dynamics. Results may vary and are intended to supplement, not replace, professional financial, career, medical, or legal advice.
          </p>
          <p className="flex-shrink-0 font-light">
            &copy; {new Date().getFullYear()} Energy Acharya Shilpa Astro Vastu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
