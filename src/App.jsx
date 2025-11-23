import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Heart, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet";

const API_URL = "https://cafeteria-rate-app.asmasoft.uz/rating";

export default function App() {
  const [selectedRating, setSelectedRating] = useState(0); // 1–5 only
  const [hoverRating, setHoverRating] = useState(0);
  const [overall, setOverall] = useState({ rating: "0.00", count: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [lastSubmittedRating, setLastSubmittedRating] = useState(0); // Store the submitted rating

  // --------- API: GET overall rating ----------
  const fetchOverall = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      const rating =
        typeof data.rating === "number" ? data.rating.toFixed(2) : "0.00";
      const count = typeof data.count === "number" ? data.count : 0;
      setOverall({ rating, count });
    } catch (err) {
      console.error("GET error:", err);
    }
  };

  useEffect(() => {
    fetchOverall();
  }, []);

  // --------- API: POST selected rating ----------
  const handleSubmit = async () => {
    if (!selectedRating || submitting) return;

    setSubmitting(true);
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: selectedRating }), // whole number
      });

      // Store the rating before resetting it
      setLastSubmittedRating(selectedRating);
      setShowModal(true);
      fetchOverall(); // refresh overall after every submit

      // Modal 3.5s da yopiladi
      setTimeout(() => {
        setShowModal(false);
        setLastSubmittedRating(0); // Reset after modal closes
      }, 3500);
      setSelectedRating(0);
    } catch (err) {
      console.error("POST error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Floating food emojis positions
  const foodBubbles = [
    { top: "6%", left: "12%", emoji: "./m1.png", size: "w-80 h-80" },
    { top: "5%", right: "10%", emoji: "./m2.png", size: "w-80 h-80" },
    { top: "45%", left: "4%", emoji: "./m3.png", size: "w-60 h-60" },
    { top: "40%", right: "4%", emoji: "./m4.png", size: "w-60 h-60" },
    { bottom: "5%", left: "14%", emoji: "./m5.png", size: "w-80 h-80" },
    { bottom: "5%", right: "15%", emoji: "./m6.png", size: "w-80 h-80" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 relative overflow-hidden px-4 py-8">
      {/* Sahifa sarlavhasi va favicon */}
      {/* Moving food images around the page */}
      {foodBubbles.map((item, idx) => (
        <motion.div
          key={idx}
          className="absolute"
          style={item}
          animate={{
            y: [0, -12, 0],
            x: [0, idx % 2 === 0 ? 10 : -10, 0],
            rotate: [-5, 5, -5],
          }}
          transition={{
            duration: 6 + idx,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src={item.emoji} className={item.size + " shadow-xl rounded-full"} alt="Floating food item" />
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative w-full max-w-2xl">
        {/* Logo in the center above the survey card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-full shadow-lg p-4 flex items-center justify-center">
            <img 
              src="./pslogo.png" 
              alt="Cafeteria Logo" 
              className="h-32 md:h-29 object-contain rounded-full"
            />
          </div>
        </motion.div>

        {/* Survey card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl px-6 py-8 md:px-10 md:py-10 flex flex-col items-center"
        >
          <h1 className="text-center text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            Cafeteria Satisfaction Survey
          </h1>
          <p className="text-gray-500 text-sm md:text-base mb-6 text-center">
            We invite you to share your thorough evaluation of our cafeteria's comprehensive services, including food variety, nutritional quality, and staff performance
          </p>

          {/* Stars (whole numbers only) */}
          <div className="flex justify-center gap-3 mb-20 mt-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
              >
                <Star
                  size={80}
                  className={`transition-transform ${
                    (hoverRating || selectedRating) >= star
                      ? "fill-yellow-400 text-yellow-400 scale-110"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedRating || submitting}
            className={`w-full md:w-2/3 py-3 rounded-xl text-white font-semibold text-base md:text-lg transition 
              ${
                !selectedRating || submitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600 shadow-md hover:shadow-lg"
              }`}
          >
            {submitting ? "Submitting..." : "Submit rating"}
          </button>
        </motion.div>

        {/* Overall card (separate card like in sketch) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 12 }}
          className="mx-auto mt-6 w-full md:w-4/5"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Overall result
              </p>
              <p className="text-2xl font-bold text-orange-500">
                {overall.rating} <span className="text-base">/ 5.00</span>
              </p>
              <p className="text-sm text-gray-500">
                Based on <span className="font-medium">{overall.count}</span>{" "}
                student votes
              </p>
            </div>
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      Number(overall.rating) >= i ? "fill-yellow-400" : ""
                    }
                  />
                ))}
              </div>
              <p className="text-[11px] text-gray-400 mt-1">
                Updated after every submission
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer - Powered by Coding Club */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 text-gray-600 text-sm"
      >
        <span>Powered by</span>
        <img 
          src="./logo.png" 
          alt="Coding Club Logo" 
          className="h-5 w-auto"
        />
        <span>Coding Club</span>
      </motion.footer>

      {/* Enhanced Thank-you modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 20, opacity: 0 }}
              className="bg-gradient-to-br from-white to-orange-50 rounded-3xl shadow-2xl px-8 py-8 max-w-sm mx-4 relative overflow-hidden border border-orange-100"
            >
              {/* Background decorative elements */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -top-6 -right-6 text-orange-200 opacity-60"
              >
                <Sparkles size={80} />
              </motion.div>
              
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -bottom-8 -left-8 text-amber-200 opacity-60"
              >
                <Heart size={80} />
              </motion.div>

              {/* Main content */}
              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 w-20 h-20 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-3xl text-white"
                  >
                    ✓
                  </motion.span>
                </motion.div>

                <motion.h2
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent"
                >
                  Thank You!
                </motion.h2>

                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-center mb-4 leading-relaxed"
                >
                  Your <span className="font-semibold text-amber-600">{lastSubmittedRating}-star</span> rating helps us improve the quality of our cafeteria services.
                </motion.p>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center gap-1 mb-4"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={20}
                      className={
                        i <= lastSubmittedRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-gray-400 text-center"
                >
                  This dialog will close automatically
                </motion.div>
              </div>
              {/* Progress bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 3.5, ease: "linear" }}
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 origin-left"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}