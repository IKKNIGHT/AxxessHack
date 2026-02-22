import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Heart } from "lucide-react";
import HeartChat from "./HeartChat";

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <HeartChat onClose={() => setIsOpen(false)} />
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 shadow-2xl flex items-center justify-center group hover:shadow-pink-300"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-8 h-8 text-white group-hover:hidden" fill="white" />
            <MessageCircle className="w-8 h-8 text-white hidden group-hover:block" />
          </motion.div>

          {/* Notification pulse */}
          <motion.div
            className="absolute inset-0 rounded-full bg-pink-400"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
          />
        </motion.button>
      )}
    </>
  );
}