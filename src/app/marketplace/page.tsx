'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useContract } from '@/hooks/useContract';
import { useTheme } from '@/app/ThemeProvider';
import { formatEther } from 'viem';
import Link from 'next/link';
import { motion } from 'framer-motion';

type Agent = {
  id: number;
  name: string;
  description: string;
  creator: string;
  price: bigint;
  imageUrl: string;
  rating: number;
  traits: string[];
};

// Create a mock version of useContract that includes agents and isLoadingAgents
// This is a temporary fix until the contract integration is complete
const useMockAgentData = () => {
  const contract = useContract();
  const [mockAgents, setMockAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const data: Agent[] = [
        {
          id: 1,
          name: 'Math Tutor',
          description: 'Expert math tutor for all grade levels',
          creator: '0x' + '1'.repeat(40),
          price: BigInt(0.1 * 10**18),
          imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=math',
          rating: 4.8,
          traits: ['Education', 'Patient', 'Analytical']
        },
        {
          id: 2,
          name: 'Creative Writer',
          description: 'Help with creative writing and storytelling',
          creator: '0x' + '2'.repeat(40),
          price: BigInt(0.2 * 10**18),
          imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=writer',
          rating: 4.5,
          traits: ['Entertainment', 'Creative', 'Articulate']
        },
        {
          id: 3,
          name: 'Business Consultant',
          description: 'Strategic business advice and planning',
          creator: '0x' + '3'.repeat(40),
          price: BigInt(0.3 * 10**18),
          imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=business',
          rating: 4.7,
          traits: ['Business', 'Strategic', 'Professional']
        },
        {
          id: 4,
          name: 'Fitness Coach',
          description: 'Personalized workout and nutrition plans',
          creator: '0x' + '4'.repeat(40),
          price: BigInt(0.15 * 10**18),
          imageUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=fitness',
          rating: 4.6,
          traits: ['Personal', 'Motivational', 'Knowledgeable']
        }
      ];
      
      setMockAgents(data);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return {
    ...contract,
    agents: mockAgents,
    isLoadingAgents: isLoading
  };
};

export default function Marketplace() {
  const { theme = 'light' } = useTheme();
  // Use the mock data provider instead of useContract directly
  const { agents, isLoadingAgents } = useMockAgentData();
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const categories = [
    'Education', 
    'Entertainment', 
    'Business', 
    'Personal'
  ];

  // Simulate loading real agent data from the contract
  useEffect(() => {
    if (!isLoadingAgents && agents) {
      setFilteredAgents(agents);
    } else {
      // Placeholder until real data is available
      const placeholderAgents: Agent[] = Array.from({ length: 8 }).map((_, i) => ({
        id: i,
        name: '',
        description: '',
        creator: '',
        price: BigInt(0),
        imageUrl: '',
        rating: 0,
        traits: []
      }));
      setFilteredAgents(placeholderAgents);
    }
  }, [agents, isLoadingAgents]);

  // Filter agents based on search term and categories
  useEffect(() => {
    if (!agents) return;
    
    let results = [...agents];
    
    if (searchTerm) {
      results = results.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategories.length > 0) {
      results = results.filter(agent => 
        agent.traits.some(trait => selectedCategories.includes(trait))
      );
    }
    
    setFilteredAgents(results);
  }, [agents, searchTerm, selectedCategories]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 pt-8">
            <h1 className="text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue">
              AI Agent Marketplace
            </h1>
            <p className="text-gray-700 dark:text-white max-w-2xl mx-auto">
              Browse and rent specialized AI agents for education, entertainment, business, or personal use
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-10 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="w-full md:w-2/3">
                <input
                  type="text"
                  placeholder="Search for agents..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategories.includes(category)
                        ? 'bg-sei-blue text-white dark:bg-sei-light-blue dark:text-black font-semibold'
                        : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-sei-light-blue/20 hover:text-sei-blue dark:hover:bg-sei-light-blue/20 dark:hover:text-sei-light-blue'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Agent grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02]"
              >
                {isLoadingAgents ? (
                  <div className="animate-pulse">
                    <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-48 bg-gradient-to-r from-sei-blue/80 to-sei-purple dark:from-sei-light-blue/50 dark:to-sei-purple relative overflow-hidden">
                      {agent.imageUrl && (
                        <img 
                          src={agent.imageUrl} 
                          alt={agent.name} 
                          className="w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-4 h-4 ${i < agent.rating ? 'text-yellow-400' : 'text-gray-400'}`} 
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-white text-xs">
                            ID: {agent.id.toString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        {agent.name || `Agent #${agent.id}`}
                      </h3>
                      <p className="text-gray-700 dark:text-white text-sm mb-4 line-clamp-2">
                        {agent.description || "This AI agent is waiting to be discovered. Explore its capabilities now."}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {agent.traits?.map((trait, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-sei-light-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue rounded-full">
                            {trait}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sei-blue dark:text-sei-light-blue font-medium">
                          {agent.price ? `${formatEther(agent.price)} SEI` : "Free to try"}
                        </div>
                        <Link href={`/agent/${agent.id}`}>
                          <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm">
                            Rent Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredAgents.length === 0 && !isLoadingAgents && (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">No agents found</h3>
              <p className="text-gray-500 dark:text-gray-100">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 