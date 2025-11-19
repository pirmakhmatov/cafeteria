import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const API_URL = "https://cafeteria-rate-app.asmasoft.uz/rating";

export default function App() {
  const [selectedRating, setSelectedRating] = useState(0); // 1–5 only
  const [hoverRating, setHoverRating] = useState(0);
  const [overall, setOverall] = useState({ rating: "0.00", count: 0 });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

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

      setShowModal(true);
      fetchOverall(); // refresh overall after every submit

      // Modal 3.5s da yopiladi
      setTimeout(() => setShowModal(false), 3500);
      setSelectedRating(0);
    } catch (err) {
      console.error("POST error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Floating food emojis positions
  const foodBubbles = [
    { top: "6%", left: "12%", emoji: "🍕" },
    { top: "10%", right: "10%", emoji: "🍔" },
    { top: "45%", left: "4%", emoji: "🥗" },
    { top: "48%", right: "4%", emoji: "🍣" },
    { bottom: "5%", left: "14%", emoji: "🍩" },
    { bottom: "8%", right: "12%", emoji: "🍹" },
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100 relative overflow-hidden px-4 py-8">
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
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-3xl md:text-4xl">
            {item.emoji}
          </div>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative w-full max-w-lg">
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
            Please rate your overall satisfaction with today’s meals.
          </p>

          {/* Stars (whole numbers only) */}
          <div className="flex justify-center gap-3 mb-6">
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
                  size={44}
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

      {/* Thank-you modal */}
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-20"
        >
          <motion.div
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl px-8 py-6 max-w-xs text-center"
          >
            <div className="mx-auto mb-3 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl text-green-500">✓</span>
            </div>
            <h2 className="text-lg font-semibold mb-1">
              Thank you for your feedback!
            </h2>
            <p className="text-sm text-gray-600">
              Your rating helps us improve the quality of the school kitchen.
            </p>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}