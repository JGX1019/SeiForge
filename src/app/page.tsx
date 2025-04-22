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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute w-full h-full bg-[url('/patterns/circuit.svg')] bg-repeat opacity-10"></div>
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div 
              key={i}
              className="absolute w-2 h-2 rounded-full bg-sei-light-blue/30 dark:bg-sei-light-blue/40"
              style={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
              }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ 
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            ></motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              How SeiForge Works
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Create, monetize and trade AI personalities in three simple steps
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "1. Create Your AI Agent",
                description: "Design your AI personality without coding. Set traits, expertise, and customize your agent's appearance.",
                icon: "/file.svg",
                delay: 0,
                color: "from-sei-blue to-sei-purple",
                bgColor: "bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20"
              },
              {
                title: "2. Mint on the Sei Blockchain",
                description: "Your AI agent is stored directly on the Sei blockchain as an NFT with a unique identifier.",
                icon: "/globe.svg",
                delay: 0.3,
                color: "from-sei-red to-sei-purple",
                bgColor: "bg-gradient-to-br from-red-500/10 to-purple-500/10 dark:from-red-500/20 dark:to-purple-500/20"
              },
              {
                title: "3. Earn Passive Income",
                description: "Set your rental pricing and earn 95% of all revenue when users subscribe to your agent.",
                icon: "/window.svg",
                delay: 0.6,
                color: "from-sei-light-blue to-sei-blue",
                bgColor: "bg-gradient-to-br from-blue-300/10 to-blue-500/10 dark:from-blue-300/20 dark:to-blue-500/20"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className={`flex flex-col items-center text-center relative ${step.bgColor} rounded-xl p-6 border border-gray-200/20 dark:border-white/5 backdrop-blur-sm shadow-lg`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.delay, duration: 0.5 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div 
                  className="mb-6 relative"
                  whileHover={{ 
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg mb-4 mx-auto border border-white/20" 
                    style={{
                      backgroundImage: `linear-gradient(to bottom right, var(--sei-light-blue), var(--sei-blue))`
                    }}
                  >
                    <img src={step.icon} alt={step.title} className="w-10 h-10 md:w-12 md:h-12 filter drop-shadow-lg" />
                    
                    {/* Glowing ring effect */}
                    <motion.div 
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{ 
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    ></motion.div>
                  </div>
                  
                  {/* Connection line between steps */}
                  {index < 2 && (
                    <div className="hidden md:flex absolute top-12 left-full w-full items-center">
                      <div className="h-0.5 bg-gradient-to-r from-sei-light-blue to-transparent w-full"></div>
                      <div className="flex-shrink-0 w-3 h-3 rounded-full bg-sei-light-blue animate-pulse"></div>
                    </div>
                  )}
                </motion.div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
                
                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-sei-light-blue/50 to-sei-blue/50 w-0 group-hover:w-full transition-all duration-700 opacity-0 group-hover:opacity-100"></div>
              </motion.div>
            ))}
          </div>
          
          {/* Added button */}
          <div className="text-center mt-12">
            <Link href="/create">
              <motion.button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-sei-blue to-sei-purple text-white shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Start Building Your Agent
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              AI Agents for Every Need
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-100 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              Discover the diverse range of AI agents available on our marketplace
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {[
              {
                category: "Education",
                examples: "Language tutors, Subject experts, Learning companions, Test prep assistants",
                icon: "🎓",
                color: "bg-blue-500",
                delay: 0
              },
              {
                category: "Entertainment",
                examples: "Celebrity personalities, Historical figures, Fictional characters, Storytellers",
                icon: "🎭",
                color: "bg-purple-500",
                delay: 0.2
              },
              {
                category: "Business",
                examples: "Customer service agents, Sales trainers, Industry consultants, Market analysts",
                icon: "💼",
                color: "bg-green-500",
                delay: 0.4
              },
              {
                category: "Personal",
                examples: "Life coaches, Fitness trainers, Mental health companions, Productivity assistants",
                icon: "🧠",
                color: "bg-orange-500",
                delay: 0.6
              }
            ].map((useCase, index) => (
              <motion.div 
                key={index}
                className="glass-effect rounded-xl p-6 relative overflow-hidden group shadow-md border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: useCase.delay, duration: 0.5 }}
              >
                <div className={`w-12 h-12 rounded-full ${useCase.color} flex items-center justify-center text-white text-2xl mb-4`}>
                  {useCase.icon}
                </div>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">{useCase.category}</h3>
                <p className="text-gray-600 dark:text-gray-300">{useCase.examples}</p>
                
                <Link href={`/marketplace?category=${useCase.category}`}>
                  <div className="mt-4 text-sei-blue dark:text-sei-light-blue font-medium flex items-center group-hover:underline">
                    Explore {useCase.category} Agents
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-sei-blue/10 to-sei-light-blue/5 dark:from-sei-light-blue/10 dark:to-sei-purple/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Agents", value: animatedTotalAgents || "0", icon: "🤖" },
              { label: "Active Users", value: "1,000+", icon: "👥" },
              { label: "Creator Earnings", value: "15,000+ SEI", icon: "💰" },
              { label: "Avg Rating", value: "4.8/5", icon: "⭐" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-sei-blue dark:text-sei-light-blue mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
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
      
      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-sei-blue dark:text-sei-light-blue">SeiForge</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">The decentralized marketplace for AI personalities on the Sei blockchain.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-sei-blue dark:text-gray-400 dark:hover:text-sei-light-blue">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-sei-blue dark:text-gray-400 dark:hover:text-sei-light-blue">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-500 hover:text-sei-blue dark:text-gray-400 dark:hover:text-sei-light-blue">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sei-blue dark:text-sei-light-blue">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Marketplace</Link></li>
                <li><Link href="/create" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Create Agent</Link></li>
                <li><Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Dashboard</Link></li>
                <li><Link href="/profile" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Profile</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4 text-sei-blue dark:text-sei-light-blue">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">About</Link></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Documentation</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-sei-blue dark:hover:text-sei-light-blue">Sei Network</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-sei-blue dark:text-sei-light-blue">Subscribe</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get the latest news and updates</p>
              <div className="flex">
                <input type="email" placeholder="Your email" className="px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sei-blue dark:focus:ring-sei-light-blue w-full" />
                <button className="bg-sei-blue hover:bg-sei-purple dark:bg-sei-light-blue dark:hover:bg-sei-purple text-white px-4 py-2 rounded-r-lg transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} SeiForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
