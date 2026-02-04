import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Valentine() {
  const { id } = useParams();
  // Using any to bypass type checks until code generation runs
  const valentine = useQuery(api.valentines.get, { id: id as any });
  const acceptValentine = useMutation(api.valentines.accept);

  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [isMoved, setIsMoved] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 }); // Stores absolute coordinates
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (valentine?.status === "accepted") {
      setIsAccepted(true);
      triggerConfetti();
    }
  }, [valentine]);

  const handleNoInteraction = () => {
    setIsMoved(true);

    // Bounds for the new position (window dimensions minus button size & padding)
    const buttonWidth = 150;
    const buttonHeight = 60;
    const padding = 20;

    const maxLeft = window.innerWidth - buttonWidth - padding;
    const maxTop = window.innerHeight - buttonHeight - padding;

    const newLeft = Math.max(padding, Math.random() * maxLeft);
    const newTop = Math.max(padding, Math.random() * maxTop);

    setNoPosition({ x: newLeft, y: newTop });

    setYesScale((prev) => prev + 0.1);
    setNoScale((prev) => Math.max(0, prev - 0.05));
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ff4d6d", "#ffccd5"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#c9184a", "#ffe5ec"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleYesClick = async () => {
    setIsAccepted(true);
    triggerConfetti();
    if (id) {
      acceptValentine({ id: id as any });
    }
  };

  if (valentine === undefined)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-primary font-bold animate-pulse">
        Loading Love... 💖
      </div>
    );

  if (valentine === null)
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-4">
        <div className="text-6xl">💔</div>
        <h1 className="text-2xl font-bold text-[#640d23]">
          Invalid or Expired Link
        </h1>
        <p className="text-[#800f2f]">
          This valentine link doesn't exist anymore.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background Blobs (duplicated for consistent feel, could be a component) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-120 h-120 bg-[#ffccd5] rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-background-end rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>
      </div>

      <AnimatePresence mode="wait">
        {isAccepted ? (
          <motion.div
            key="accepted"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-12 text-center max-w-lg w-full z-10 rounded-3xl"
          >
            <div className="text-8xl mb-6 animate-bounce">🎉</div>
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-primary-dark mb-4">
              YAY!
            </h1>
            <p className="text-2xl text-[#640d23] font-medium leading-relaxed">
              You just made someone very happy!
            </p>
            <p className="mt-8 text-lg font-bold text-primary-dark">
              Now, let's celebrate! 🥂
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="question"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-2xl relative z-10 text-center"
          >
            <div className="mb-8 flex justify-center">
              <img
                src="/valentine-bear.png"
                alt="Cute Bear"
                className="w-full max-w-75 rounded-3xl shadow-xl border-4 border-white/50"
              />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-[#640d23] mb-4 leading-tight">
              {valentine.message || "Will you be my Valentine?"}
            </h1>

            {valentine.senderName && (
              <p className="text-xl text-[#800f2f] mb-12 italic font-medium">
                - From {valentine.senderName}
              </p>
            )}

            <div className="flex justify-center text-black font-medium items-center gap-6 mt-8 h-25 relative">
              <motion.button
                onClick={handleYesClick}
                className="btn-modern w-auto px-12 py-4 text-2xl"
                style={{
                  scale: yesScale,
                  zIndex: 20,
                }}
                whileHover={{ scale: yesScale * 1.1 }}
                whileTap={{ scale: yesScale * 0.9 }}
              >
                Yes ❤️
              </motion.button>

              <motion.button
                onMouseEnter={handleNoInteraction}
                onClick={handleNoInteraction}
                onTouchStart={handleNoInteraction}
                className="px-8 py-3 bg-[#e9ecef] text-[#495057] rounded-xl font-bold transition-colors"
                style={{
                  position: isMoved ? "fixed" : "relative",
                  left: isMoved ? noPosition.x : "auto",
                  top: isMoved ? noPosition.y : "auto",
                  boxShadow: "none",
                }}
                animate={{
                  opacity: noScale,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                No 😐
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
