import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Join from "./pages/Join";

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-luxury-white text-gold-900 overflow-x-hidden">
        {/* Scroll helper */}
        <ScrollToTop />

        {/* Global Floating Header */}
        <Navbar />

        {/* Page Routing */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/join" element={<Join />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
