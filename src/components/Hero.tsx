import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Sun } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-luxury-gradient">
      {/* Decorative Astrological Elements */}

      {/* Venus Astrological Mandala SVG (Large, Spinning Slowly in Background) */}
      <div className="absolute right-[-10%] md:right-[5%] top-[15%] w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] opacity-[0.12] md:opacity-[0.18] pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full text-gold-500 animate-spin-slow"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
        >
          {/* Concentric Spheres */}
          <circle cx="250" cy="250" r="240" />
          <circle cx="250" cy="250" r="200" strokeDasharray="4,4" />
          <circle cx="250" cy="250" r="160" />
          <circle cx="250" cy="250" r="100" />
          <circle cx="250" cy="250" r="50" strokeDasharray="2,2" />

          {/* Zodiac / Planetary Lines */}
          <line x1="250" y1="10" x2="250" y2="490" />
          <line x1="10" y1="250" x2="490" y2="250" />
          <line x1="80" y1="80" x2="420" y2="420" />
          <line x1="80" y1="420" x2="420" y2="80" />

          {/* Intricate Venus Pentagram (Venus orbits trace a five-fold rose pattern over 8 years) */}
          <polygon points="250,50 430,180 360,400 140,400 70,180" strokeWidth="0.5" />
          <polygon points="250,90 380,195 330,360 170,360 120,195" strokeWidth="0.5" strokeDasharray="3,3" />

          {/* Star nodes */}
          <circle cx="250" cy="50" r="4" fill="currentColor" />
          <circle cx="430" cy="180" r="4" fill="currentColor" />
          <circle cx="360" cy="400" r="4" fill="currentColor" />
          <circle cx="140" cy="400" r="4" fill="currentColor" />
          <circle cx="70" cy="180" r="4" fill="currentColor" />
        </svg>
      </div>

      {/* Secondary reverse rotating ring */}
      <div className="absolute left-[-5%] bottom-[-10%] w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] opacity-[0.08] pointer-events-none select-none z-0">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full text-gold-600 animate-spin-reverse"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
        >
          <circle cx="200" cy="200" r="190" strokeDasharray="6,3" />
          <circle cx="200" cy="200" r="140" />
          <polygon points="200,60 321,270 79,270" />
          <polygon points="200,340 321,130 79,130" />
        </svg>
      </div>

      {/* Floating Sparkles & Light Orbs */}
      <div className="absolute top-[20%] left-[10%] w-2 h-2 rounded-full bg-gold-400 opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute top-[45%] left-[25%] w-1.5 h-1.5 rounded-full bg-gold-500 opacity-40 animate-ping pointer-events-none" />
      <div className="absolute bottom-[25%] right-[20%] w-3 h-3 rounded-full bg-gold-300 opacity-50 animate-pulse pointer-events-none" />

      {/* Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Hero Text */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">

            {/* Tagline */}
            {/* <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-gold-50/70 border border-gold-300/30 px-4 py-1.5 rounded-full"
            >
              <Sparkles className="w-4 h-4 text-gold-500 animate-spin-slow" />
              <span className="text-[11px] font-semibold tracking-widest text-gold-700 uppercase">
                Align Your Space & Stars
              </span>
            </motion.div> */}

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl md:text-6xl text-gold-900 leading-[1.15] tracking-wide"
            >
              Unlock Abundance, Career Success & Peace with <span className="text-gold-gradient font-medium italic block sm:inline">Astro Vastu</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-gold-900/70 font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Don't let cosmic friction and spatial blocks drain your energy. Synthesize your birth chart (Astrology) with your living space (Vastu) to invite Venusian wealth, stable relationships, and rapid career growth.
            </motion.p>

            {/* CTA Button Block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Link
                to="/join"
                className="w-full sm:w-auto text-center px-8 py-4 bg-gold-500 text-white rounded-full font-semibold tracking-wider text-sm shadow-[0_10px_30px_rgba(197,145,84,0.3)] hover:bg-gold-600 transition-all duration-300 hover:scale-[1.02] border border-gold-400 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#problems"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-full border border-gold-400/35 text-gold-900/80 hover:bg-gold-50/50 hover:text-gold-500 font-semibold tracking-wider text-sm transition-all duration-300 cursor-pointer"
              >
                Discover how it works
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="pt-10 grid grid-cols-3 gap-4 border-t border-gold-subtle/40 max-w-xl mx-auto lg:mx-0"
            >
              <div className="text-center lg:text-left space-y-1">
                <p className="text-xl sm:text-2xl font-serif font-semibold text-gold-800">10k+</p>
                <p className="text-[10px] uppercase tracking-wider text-gold-900/60 font-medium">Lives Aligned</p>
              </div>
              <div className="text-center lg:text-left space-y-1">
                <p className="text-xl sm:text-2xl font-serif font-semibold text-gold-800">15+ Yrs</p>
                <p className="text-[10px] uppercase tracking-wider text-gold-900/60 font-medium">Spiritual Wisdom</p>
              </div>
              <div className="text-center lg:text-left space-y-1">
                <p className="text-xl sm:text-2xl font-serif font-semibold text-gold-800">99.4%</p>
                <p className="text-[10px] uppercase tracking-wider text-gold-900/60 font-medium">Satisfaction</p>
              </div>
            </motion.div>

          </div>

          {/* Right Side Visual Accent (Venus Portrait/Aura Placeholder) */}
          <div className="lg:col-span-5 flex justify-center items-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative w-[280px] sm:w-[365px] h-[350px] sm:h-[450px] rounded-t-full border-[10px] border-white shadow-2xl glass-card overflow-hidden flex flex-col justify-between p-8"
            >
              {/* Golden Sun Emblem inside the frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Sun className="w-40 h-40 text-gold-500 animate-spin-reverse" strokeWidth="0.5" />
              </div>

              <div className="space-y-4 relative z-10 text-center mt-8">
                <p className="font-serif italic text-lg text-gold-700">"As above, so below."</p>
                <div className="gold-divider mx-auto w-16" />
              </div>

              <div className="space-y-3 relative z-10 bg-white/70 p-4 rounded-xl border border-gold-300/20 backdrop-blur-sm shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-600">Daily Alignment</p>
                <p className="text-sm font-serif font-medium text-gold-900 leading-normal">
                  "By correcting the Northern direction of my home and aligning it with my Mercury placement, my stagnant business revenue tripled in 45 days."
                </p>
                <p className="text-[10px] text-gold-500 font-bold uppercase tracking-widest">— Shruti K., Tech Founder</p>
              </div>
            </motion.div>

            {/* Floating golden planetary ring behind the framed card */}
            <div className="absolute -z-10 w-[320px] sm:w-[400px] h-[320px] sm:w-[400px] rounded-full border border-gold-400/20 pointer-events-none animate-pulse" />
          </div>

        </div>
      </div>
    </section>
  );
}
