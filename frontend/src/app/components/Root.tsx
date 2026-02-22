import { Outlet, Link, useLocation } from "react-router";
import { Heart, FileHeart, History, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Root() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Heart },
    { path: "/assessment", label: "Health Check", icon: FileHeart },
    { path: "/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-rose-50">
      {/* Decorative floating hearts */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 50,
              scale: 0.5 + Math.random() * 0.5,
              opacity: 0.3
            }}
            animate={{ 
              y: -100,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          >
            <Heart className="w-6 h-6" fill="currentColor" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-pink-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.div 
                className="relative"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 via-red-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden">
                  <Heart className="w-8 h-8 text-white relative z-10" fill="white" />
                  <motion.div
                    className="absolute inset-0 bg-white"
                    animate={{ 
                      scale: [0, 2],
                      opacity: [0.5, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                  />
                </div>
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400" fill="currentColor" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent">
                  Artery Party
                </h1>
                <p className="text-sm text-pink-600 font-medium flex items-center gap-1">
                  <Heart className="w-3 h-3" fill="currentColor" />
                  Keep Your Heart Happy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white/60 backdrop-blur-sm border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-5 py-3 border-b-3 transition-all relative ${
                    isActive
                      ? "border-pink-500 text-pink-600 font-medium"
                      : "border-transparent text-gray-600 hover:text-pink-600 hover:border-pink-300"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'fill-pink-500' : ''}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-pink-50 rounded-t-lg -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Outlet />
      </main>
    </div>
  );
}
