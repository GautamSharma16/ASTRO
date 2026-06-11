import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Calendar, Clock, MapPin, User,
  Mail, Phone, Briefcase, FileText,
  CheckCircle2, AlertCircle, X, ShieldCheck,
} from "lucide-react";

import { saveLead, updatePaymentStatus } from "../services/leadService";
import { openRazorpayCheckout, generateMockTransactionId } from "../services/paymentService";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FormData {
  name: string;
  mobile: string;
  profession: string;
  email: string;
  city: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  issues: string;
}

const EMPTY_FORM: FormData = {
  name: "", mobile: "", profession: "", email: "",
  city: "", dob: "", birthTime: "", birthPlace: "", issues: "",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Join() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [sessionKey, setSessionKey] = useState<string>("");

  // Modal visibility
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showMockPaymentDialog, setShowMockPaymentDialog] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState({ id: "", amount: "₹4,999" });

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage("Capturing cosmic details...");

    // 1. Save lead to Google Sheets via leadService
    const key = await saveLead(formData);
    setSessionKey(key);

    setStatusMessage("Opening Razorpay Checkout...");

    // 2. Open Razorpay checkout via paymentService
    const result = await openRazorpayCheckout({
      amountInPaise: 499900, // ₹4,999
      description: "Premium Consultation & Remedies Blueprint",
      prefill: {
        name: formData.name,
        email: formData.email,
        contact: formData.mobile,
      },
      notes: {
        dob: formData.dob,
        birthTime: formData.birthTime,
      },
      onSuccess: async (paymentId) => {
        setTransactionDetails({ id: paymentId, amount: "₹4,999" });
        await updatePaymentStatus(key, "Paid", paymentId);
        setShowSuccessModal(true);
      },
      onDismiss: async () => {
        await updatePaymentStatus(key, "Failed", "");
        setShowFailedModal(true);
      },
    });

    setLoading(false);
    setStatusMessage("");

    // 3. Fall back to mock UI if Razorpay SDK is unavailable / key not set
    if (!result.launched) {
      setShowMockPaymentDialog(true);
    }
  };

  // Mock payment actions (sandbox / dev only)
  const handleMockPaymentResult = async (status: "Paid" | "Failed") => {
    setShowMockPaymentDialog(false);
    const mockTxId = status === "Paid" ? generateMockTransactionId() : "";
    setTransactionDetails({ id: mockTxId, amount: "₹4,999" });

    if (sessionKey) {
      await updatePaymentStatus(sessionKey, status, mockTxId);
    }

    if (status === "Paid") {
      setShowSuccessModal(true);
    } else {
      setShowFailedModal(true);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="relative min-h-screen pt-28 pb-20 bg-luxury-gradient overflow-hidden">
      {/* Decorative geometric rings */}
      <div className="absolute top-[10%] left-[-5%] w-72 h-72 border border-gold-300/10 rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-96 h-96 border border-gold-300/10 rounded-full pointer-events-none animate-pulse" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

        {/* Page Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 bg-gold-50/70 border border-gold-300/30 px-4 py-1 rounded-full">
            <span className="text-[10px] font-bold tracking-widest text-gold-700 uppercase">
              Secure Consultation Portal
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-gold-900 leading-tight">
            Claim Your Astro Vastu Consultation
          </h1>
          <p className="text-xs sm:text-sm text-gold-900/60 max-w-xl mx-auto font-light">
            Fill in your astrological coordinates below to secure your 1-on-1 analysis
            blueprint with Energy Acharya Shilpa.
          </p>
        </div>

        {/* VSL Video */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden border border-gold-400/30 shadow-2xl glass-panel p-2 sm:p-4 bg-white"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-inner group">
            <iframe
              src="https://player.vimeo.com/video/911802958?h=2540c74900&title=0&byline=0&portrait=0"
              title="Astro Vastu VSL"
              className="absolute inset-0 w-full h-full"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
            <div className="absolute inset-0 border border-white/10 rounded-xl pointer-events-none group-hover:border-gold-400/20 transition-colors" />
          </div>
          <div className="text-center pt-3 pb-1">
            <p className="text-xs text-gold-800 font-medium tracking-wide">
              WATCH: How standard Vastu remedies might conflict with your Horoscope (10 Mins)
            </p>
          </div>
        </motion.div>

        {/* Consultation Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="p-6 sm:p-10 rounded-3xl border border-gold-400/25 glass-card bg-white shadow-xl space-y-8"
        >
          <div className="border-b border-gold-50 pb-6 text-center sm:text-left">
            <h2 className="font-serif text-xl sm:text-2xl font-semibold text-gold-900">
              Personal Birth Chart & House Coordinates
            </h2>
            <p className="text-xs text-gold-900/60 mt-1 font-light">
              Accuracy in birth time and place is critical for mapping planetary coordinates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gold-500" /> Full Name
                </label>
                <input type="text" name="name" required placeholder="e.g. Shruti Keshav"
                  value={formData.name} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gold-500" /> Mobile Number (WhatsApp)
                </label>
                <input type="tel" name="mobile" required placeholder="e.g. +91 98765 43210"
                  value={formData.mobile} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-gold-500" /> Profession
                </label>
                <input type="text" name="profession" required placeholder="e.g. Business Owner / Software Lead"
                  value={formData.profession} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gold-500" /> Email Address
                </label>
                <input type="email" name="email" required placeholder="e.g. shruti@example.com"
                  value={formData.email} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" /> Current City of Residence
                </label>
                <input type="text" name="city" required placeholder="e.g. Mumbai"
                  value={formData.city} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold-500" /> Date of Birth
                </label>
                <input type="date" name="dob" required
                  value={formData.dob} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-500" /> Time of Birth (Exact)
                </label>
                <input type="time" name="birthTime" required
                  value={formData.birthTime} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-500" /> Place of Birth (City, State)
                </label>
                <input type="text" name="birthPlace" required placeholder="e.g. Pune, Maharashtra"
                  value={formData.birthPlace} onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light" />
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gold-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-gold-500" />
                Top 3 Issues You Want To Resolve Through Astro Vastu
              </label>
              <textarea name="issues" required rows={4}
                placeholder="Briefly describe the top 3 blockages you are facing. (e.g. 1. Stagnant business sales, 2. Chronic marriage arguments, 3. Severe lack of clarity and focus)"
                value={formData.issues} onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gold-400/20 bg-gold-50/10 focus:bg-white focus:outline-none focus:border-gold-400 transition-colors text-sm text-gold-950 font-light resize-none leading-relaxed" />
            </div>

            {/* Pricing */}
            {/* <div className="p-5 rounded-2xl bg-gold-50/40 border border-gold-400/10 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gold-500 font-bold uppercase tracking-wider">Premium Consultation Fee</p>
                <p className="text-xs text-gold-900/60 font-light">Includes PDF Blueprint & 1 Year Support</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-gold-900/50 line-through pr-2 font-light">₹15,000</span>
                <span className="font-serif text-2xl font-bold text-gold-900">₹4,999</span>
                <span className="text-[10px] text-gold-600 block font-medium">All Inclusive</span>
              </div>
            </div> */}

            {/* Submit */}
            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-bold tracking-widest text-xs uppercase shadow-[0_10px_25px_rgba(197,145,84,0.25)] hover:shadow-[0_12px_30px_rgba(197,145,84,0.4)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 border border-gold-400 cursor-pointer">
                {loading ? statusMessage : "Join Now"}
              </button>
              <div className="flex justify-center items-center gap-1.5 mt-3 text-[10px] text-gold-900/50 font-light">
                {/* <ShieldCheck className="w-3.5 h-3.5 text-gold-500" /> */}
               
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* ====================================================================
          MODALS
      ==================================================================== */}
      <AnimatePresence>

        {/* SUCCESS */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/30 text-center space-y-6 shadow-2xl">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-50 border border-green-400/20 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-gold-900">Alignment Initiated!</h3>
                <p className="text-sm text-gold-900/70 font-light leading-relaxed">
                  Thank you, <strong>{formData.name}</strong>. Your birth coordinates have been captured and your payment of <strong>{transactionDetails.amount}</strong> is verified.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-gold-50/40 border border-gold-400/10 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Transaction ID:</span>
                  <span className="font-mono text-gold-900 font-semibold">{transactionDetails.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gold-900/50">Lead Status:</span>
                  <span className="font-semibold text-green-700">Paid (Synchronized)</span>
                </div>
              </div>
              <p className="text-[11px] text-gold-900/50 leading-relaxed font-light">
                Our support team will email you a consultation confirmation and request your house layout plan in the next 15 minutes.
              </p>
              <button onClick={() => { setShowSuccessModal(false); window.location.href = "/"; }}
                className="w-full py-3.5 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-colors border border-gold-400 cursor-pointer">
                Return to Home
              </button>
            </motion.div>
          </div>
        )}

        {/* PAYMENT FAILED */}
        {showFailedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/30 text-center space-y-6 shadow-2xl relative">
              <button onClick={() => setShowFailedModal(false)}
                className="absolute top-4 right-4 text-gold-900/50 hover:text-gold-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
              <div className="mx-auto w-16 h-16 rounded-full bg-red-50 border border-red-400/20 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-red-900">Payment Unsuccessful</h3>
                <p className="text-sm text-gold-900/70 font-light leading-relaxed">
                  The payment was either cancelled or failed to process.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-red-50/10 border border-red-400/10 text-left space-y-2 text-xs">
                <p className="text-[11px] text-red-800/80 font-medium">
                  NOTE: Your profile details have already been saved. You do not need to re-enter them.
                </p>
                <div className="flex justify-between border-t border-red-100/30 pt-2">
                  <span className="text-gold-900/50">Lead Status:</span>
                  <span className="font-semibold text-red-600">Pending Payment</span>
                </div>
              </div>
              <p className="text-[11px] text-gold-900/50 leading-relaxed font-light">
                Please try again. We have reserved your slot for the next 24 hours.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowFailedModal(false)}
                  className="flex-1 py-3 bg-gold-50 border border-gold-400/30 hover:bg-gold-100/40 text-gold-900 rounded-full text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer">
                  Retry Payment
                </button>
                <button onClick={() => { setShowFailedModal(false); window.location.href = "/"; }}
                  className="flex-1 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-colors border border-gold-400 cursor-pointer">
                  Home
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* MOCK PAYMENT DIALOG (dev / sandbox only) */}
        {showMockPaymentDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full border border-gold-400/40 text-center space-y-6 shadow-2xl">
              <div className="flex justify-center items-center space-x-2">
                <Sparkles className="w-5 h-5 text-gold-500 animate-pulse" />
                <span className="font-serif text-lg font-bold uppercase tracking-wider text-gold-900">Razorpay Mock Gate</span>
              </div>
              <div className="gold-divider" />
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gold-950">Simulating Razorpay Transaction</p>
                <p className="text-xs text-gold-900/70 font-light leading-relaxed">
                  A live Razorpay Key ID is not configured. Running in sandbox simulation mode.
                </p>
                <div className="bg-gold-50/50 p-4 rounded-xl border border-gold-400/10 text-left text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-gold-900/50">Consultant:</span>
                    <span className="font-semibold text-gold-900">Energy Acharya Shilpa</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-900/50">Client:</span>
                    <span className="font-semibold text-gold-900">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-900/50">Email:</span>
                    <span className="font-semibold text-gold-900">{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gold-900/50">Amount:</span>
                    <span className="font-serif text-sm font-bold text-gold-950">₹4,999</span>
                  </div>
                  <div className="flex justify-between border-t border-gold-200/20 pt-2 text-[10px] text-green-700 font-bold uppercase">
                    <span>Lead Status:</span>
                    <span>Saved (Pending Payment)</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gold-900/50 font-light">
                Simulate a payment result below.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => handleMockPaymentResult("Paid")}
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-colors shadow-md cursor-pointer">
                  Simulate Success
                </button>
                <button onClick={() => handleMockPaymentResult("Failed")}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold tracking-widest uppercase transition-colors shadow-md cursor-pointer">
                  Simulate Failure
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}
