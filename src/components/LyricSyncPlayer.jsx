import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Moon, Star } from "lucide-react";

const StarBackground = () => {
  const createStars = (count) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
    }));
  };

  const [stars] = useState(createStars(100));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute bg-white rounded-full"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const LyricSyncPlayer = () => {
  const [lyrics, setLyrics] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetch("/lyrics.json")
      .then((res) => res.json())
      .then((data) => setLyrics(data))
      .catch((err) => console.error("Error loading lyrics:", err));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const index = lyrics.findIndex((line) => currentTime < line.time);
    setActiveIndex(index === -1 ? lyrics.length - 1 : Math.max(index - 1, 0));
  }, [currentTime, lyrics]);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0B0C10] via-[#1F2833] to-[#0B0C10] flex items-center justify-center p-4 overflow-hidden">
      <StarBackground />

      <div className="relative z-10 w-full max-w-md bg-[#1F2833]/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#45A29E]/20 overflow-hidden">
        <div className="absolute top-4 left-4 text-[#66FCF1] opacity-50">
          <Star className="w-6 h-6" />
        </div>
        <div className="absolute top-4 right-4 text-[#66FCF1] opacity-50">
          <Moon className="w-6 h-6" />
        </div>

        <div className="p-6 text-center relative">
          <h1 class="text-4xl font-extralight text-white tracking-wide flex items-center justify-center gap-3">
            <img
              src="/wrdnika-white.png"
              alt="Logo"
              class="w-10 h-10 object-contain rounded-xl"
            />
            Wrdnika
          </h1>

          <div className="relative h-64 overflow-hidden mb-6">
            <AnimatePresence>
              {isPlaying ? (
                <motion.div
                  key="lyrics"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  {lyrics.map((line, index) => (
                    <motion.p
                      key={index}
                      className={`text-xl font-medium transition-all duration-500 ${
                        index === activeIndex
                          ? "text-[#66FCF1] scale-110 font-bold"
                          : "text-[#66FCF1]/40"
                      }`}
                      animate={{
                        opacity: index === activeIndex ? 1 : 0.3,
                        scale: index === activeIndex ? 1.1 : 1,
                      }}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-full text-[#66FCF1]"
                >
                  <p className="text-xl mb-4">SIA - Chandelier</p>
                  <p className="text-[#66FCF1]/70 mb-6">Press to play lyrics</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-[#45A29E]/30 text-[#66FCF1] rounded-full p-4 hover:bg-[#45A29E]/40 transition-all duration-300 border border-[#66FCF1]/20"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LyricSyncPlayer;
