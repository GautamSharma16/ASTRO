import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-luxury-white text-gold-900 flex items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm border border-gold-200 shadow-2xl rounded-3xl p-10 text-center">
        <p className="text-lg uppercase tracking-[0.35em] text-gold-700 font-semibold">404</p>
        <h1 className="mt-4 text-4xl sm:text-5xl font-serif font-bold text-gold-900">
          Page Not Found
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gold-900/70 leading-relaxed">
          The page you are looking for does not exist or has been moved. Please use the link below to return to the homepage.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-white transition hover:bg-gold-600"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
