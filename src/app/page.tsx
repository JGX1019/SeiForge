'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useEffect, useState, useRef } from 'react';
import { useContract } from '@/hooks/useContract';
import { formatEther } from 'viem';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/app/ThemeProvider';

export default function Home() {
  const { theme = 'light' } = useTheme();
  const { totalAgents, isLoadingTotalAgents } = useContract();
  const [animatedTotalAgents, setAnimatedTotalAgents] = useState(0);
  const [visibleSection, setVisibleSection] = useState('hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Parallax effects
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.2, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Animate total agents count when loaded
  useEffect(() => {
    if (!isLoadingTotalAgents && totalAgents > 0) {
      let start = 0;
      const increment = Math.max(1, Math.floor(totalAgents / 30));
      const timer = setInterval(() => {
        start += increment;
        if (start > totalAgents) {
          clearInterval(timer);
          setAnimatedTotalAgents(totalAgents);
        } else {
          setAnimatedTotalAgents(start);
        }
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isLoadingTotalAgents, totalAgents]);

  // Intersection observer for sections
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSection(entry.target.id);
        }
      });
    }, { threshold: 0.5 });
    
    if (containerRef.current) observer.observe(containerRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);
    
    return () => observer.disconnect();
  }, []);

  // Mouse position for 3D effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width - 0.5;
        const y = (e.clientY - top) / height - 0.5;
        setMousePosition({ x, y });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section id="hero" ref={containerRef} className="relative bg-gradient-to-br from-sei-blue to-sei-purple dark:from-sei-mid-blue dark:to-sei-purple text-white overflow-hidden">
        {/* Dynamic background patterns */}
        <div className="absolute inset-0 overflow-hidden opacity-30">
          <div className="absolute w-full h-full bg-[url('/patterns/circuit.svg')] bg-repeat opacity-10"></div>
          
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white animate-pulse-soft"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`
              }}
            ></div>
          ))}
        </div>
        
        <motion.div 
          className="container mx-auto px-4 py-24 md:py-32 lg:py-40 relative z-10"
          style={{ 
            y,
            perspective: 1000
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              transform: `rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg)`,
              transformStyle: 'preserve-3d'
            }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 text-white relative inline-block"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
            >
              <span className="relative z-10">
                Create & Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-sei-light-blue glow-text">AI Agents</span> on Sei
              </span>
              <motion.span 
                className="absolute -inset-1 rounded-lg bg-gradient-to-r from-sei-light-blue/20 to-sei-blue/20 blur-lg"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              ></motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-white/95 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The first decentralized marketplace for creating, trading, and monetizing AI agents. 
              Build once, earn forever on the fastest Layer-1 blockchain.
            </motion.p>
            
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-6 md:p-8 mb-12 border border-white/20 transform hover:scale-105 transition-all duration-300 shadow-lg">
              <div className="text-4xl md:text-5xl font-bold text-white mb-3">
                {isLoadingTotalAgents ? (
                  <div className="h-12 w-32 mx-auto bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <motion.span
                    key={animatedTotalAgents}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="glow-text"
                  >
                    {animatedTotalAgents}+
                  </motion.span>
                )}
              </div>
              <p className="text-sm md:text-base text-white">Agents Created So Far</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <motion.button 
                  className="px-8 py-3 rounded-lg bg-sei-blue/80 hover:bg-sei-blue text-white border border-white/20 font-medium w-full sm:w-auto shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Explore Marketplace
                </motion.button>
              </Link>
              
              <Link href="/create">
                <motion.button 
                  className="px-8 py-3 rounded-lg bg-sei-blue/80 hover:bg-sei-blue text-white border border-white/20 font-medium w-full sm:w-auto shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  Create Your Agent
                </motion.button>
              </Link>
            </div>
          </motion.div>
          
          {/* Floating elements */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-sei-purple to-transparent"></div>
          
          <motion.div 
            className="absolute -bottom-10 left-1/4 w-24 h-24 lg:w-32 lg:h-32"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full bg-gradient-to-tr from-white/30 to-sei-light-blue/30 rounded-full backdrop-blur-xl"></div>
          </motion.div>
          
          <motion.div 
            className="absolute -top-5 right-1/3 w-16 h-16 lg:w-24 lg:h-24"
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, -8, 0]
            }}
            transition={{ 
              duration: 7,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="w-full h-full bg-gradient-to-bl from-white/20 to-sei-light-blue/20 rounded-full backdrop-blur-xl"></div>
          </motion.div>
        </motion.div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path 
              fill={theme === 'dark' ? '#111827' : '#ffffff'} 
              fillOpacity="1" 
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,133.3C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            </path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Why Create on SeiForge?
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Build AI agents that live on-chain with true ownership and monetization options
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Lightning Fast Transactions",
                description: "Create and trade agents with sub-second finality on Sei's high-performance blockchain",
                icon: "⚡",
                delay: 0
              },
              {
                title: "True Ownership",
                description: "Your AI agents are minted as NFTs with on-chain verification and provable ownership",
                icon: "🔐",
                delay: 0.2
              },
              {
                title: "Passive Income",
                description: "Earn royalties whenever your agents are used or traded in the marketplace",
                icon: "💰",
                delay: 0.4
              },
              {
                title: "Composable Agents",
                description: "Build agents that can interact with other agents and smart contracts",
                icon: "🧩",
                delay: 0.6
              },
              {
                title: "Low Fees",
                description: "Benefit from Sei's optimized transaction costs, perfect for microtransactions",
                icon: "📉",
                delay: 0.8
              },
              {
                title: "Developer Friendly",
                description: "Easy-to-use tools and SDKs to create sophisticated AI agents without complexity",
                icon: "👨‍💻",
                delay: 1
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 card-hover border border-gray-200 dark:border-gray-700 relative overflow-hidden group shadow-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-sei-light-blue/5 dark:bg-sei-light-blue/10 rounded-full group-hover:scale-150 transition-all duration-700"></div>
                
                <div className="mb-4 text-3xl bg-gradient-to-br from-sei-blue to-sei-purple dark:from-sei-light-blue dark:to-sei-purple inline-block rounded-lg p-3 text-white">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-100">{feature.description}</p>
                
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sei-light-blue to-sei-blue dark:from-sei-light-blue dark:to-sei-purple w-0 group-hover:w-full transition-all duration-700"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        id="cta" 
        ref={ctaRef}
        className="py-20 bg-gradient-to-br from-sei-light-blue/10 to-sei-blue/5 dark:from-sei-light-blue/5 dark:to-sei-purple/10 relative overflow-hidden"
      >
        {/* Animated shapes */}
        <div className="absolute inset-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-sei-light-blue/10 dark:bg-sei-light-blue/5"
              style={{
                width: `${50 + Math.random() * 100}px`,
                height: `${50 + Math.random() * 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-sei-blue dark:text-sei-light-blue">
              Ready to Build Your AI Agent?
            </h2>
            <p className="text-lg mb-8 text-gray-700 dark:text-gray-100">
              Join the SeiForge community today and start creating AI agents that generate passive income. 
              The future of AI belongs to creators.
            </p>
            <Link href="/create">
              <motion.button 
                className="bg-sei-blue hover:bg-sei-purple dark:bg-sei-light-blue dark:hover:bg-sei-purple text-white px-10 py-4 rounded-lg font-medium text-lg shadow-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Creating Now
              </motion.button>
            </Link>
          </motion.div>
    </div>
      </section>
    </main>
  );
}
