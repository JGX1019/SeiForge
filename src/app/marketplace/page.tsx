'use client';

import { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { useContract, Agent } from '@/hooks/useContract';
import { useTheme } from '@/app/ThemeProvider';
import { formatEther } from 'viem';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useAccount } from 'wagmi';

// Avatar options for random generation
const AVATAR_STYLES = ['bottts', 'pixel-art', 'shapes', 'identicon', 'micah', 'thumbs'];

// Enhanced agent type with UI-specific properties
type EnhancedAgent = Agent & {
  imageUrl: string;
  traits: string[];
  description: string;
  rating: number;
};

// Define category-related data
const CATEGORIES = ['Education', 'Entertainment', 'Business', 'Personal'];
const TRAITS = {
  'Education': ['Patient', 'Analytical', 'Knowledgeable', 'Articulate', 'Structured'],
  'Entertainment': ['Creative', 'Humorous', 'Engaging', 'Improvisational', 'Expressive'],
  'Business': ['Professional', 'Strategic', 'Analytical', 'Decisive', 'Motivational'],
  'Personal': ['Empathetic', 'Supportive', 'Motivational', 'Encouraging', 'Intuitive']
};

const DESCRIPTIONS = {
  'Education': [
    'Expert tutor for all grade levels',
    'Specialized language instructor',
    'Subject matter expert for academic topics',
    'Test preparation assistant',
    'Personalized learning companion'
  ],
  'Entertainment': [
    'Creative storyteller for immersive experiences',
    'Character roleplaying personality',
    'Interactive game companion',
    'Humor and comedy specialist',
    'Historical figure simulation'
  ],
  'Business': [
    'Strategic business advisor',
    'Sales training assistant',
    'Industry consultant with expertise',
    'Market analysis specialist',
    'Customer service representative'
  ],
  'Personal': [
    'Life coach for personal growth',
    'Fitness training companion',
    'Mental health support assistant',
    'Productivity enhancement assistant',
    'Daily planning and organization aid'
  ]
};

// Helper functions defined outside component to avoid re-creation on each render
const generateAvatarUrl = (agent: Agent): string => {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
  const seed = agent.name || `agent-${agent.id}`;
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

const generateDescription = (category: string): string => {
  const categoryDescriptions = DESCRIPTIONS[category as keyof typeof DESCRIPTIONS] || DESCRIPTIONS['Business'];
  return categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];
};

const generateTraits = (category: string, count: number = 3): string[] => {
  const categoryTraits = TRAITS[category as keyof typeof TRAITS] || TRAITS['Business'];
  const shuffled = [...categoryTraits].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Check if an error message indicates the agent doesn't exist
const isAgentNotExistError = (error: any): boolean => {
  if (!error) return false;
  const errorMessage = error.toString().toLowerCase();
  return errorMessage.includes('agent does not exist') || 
         errorMessage.includes('execution reverted');
};

// Component to safely use searchParams
function MarketplaceContent() {
  const { theme = 'light' } = useTheme();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');
  
  // Use the actual contract implementation
  const { totalAgents, isLoadingTotalAgents, getAgentDetails, userRentedAgentIds } = useContract();
  const { address } = useAccount();
  const isConnected = Boolean(address);
  
  const [agents, setAgents] = useState<EnhancedAgent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [filteredAgents, setFilteredAgents] = useState<EnhancedAgent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [rentedAgentIds, setRentedAgentIds] = useState<number[]>([]);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  // Fetch agents from the contract only once when component mounts
  useEffect(() => {
    if (hasAttemptedFetch) return; // Only run once
    
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;
    
    const fetchAgents = async () => {
      try {
        setIsLoadingAgents(true);
        setHasAttemptedFetch(true);
        
        // Try to fetch agents with IDs 0-19 (broader range to find existing agents)
        const maxAgentId = 30;
        console.log(`Attempting to fetch agents with IDs 0-${maxAgentId-1}`);
        
        const validAgents: EnhancedAgent[] = [];
        
        // Process agents in batches to avoid overwhelming the network
        const batchSize = 5;
        
        for (let batchStart = 0; batchStart < maxAgentId; batchStart += batchSize) {
          const batchEnd = Math.min(batchStart + batchSize, maxAgentId);
          const batchPromises: Promise<EnhancedAgent | null>[] = [];
          
          for (let i = batchStart; i < batchEnd; i++) {
            batchPromises.push(
              getAgentDetails(i)
                .then(agent => {
                  if (!agent || !isMounted) return null;
                  
                  // Filter out agents with default names like "Agent X"
                  if (agent.name.match(/^Agent \d+$/)) {
                    console.log(`Skipping agent with default name: ${agent.name}`);
                    return null;
                  }
                  
                  console.log(`Successfully fetched agent ${i}: ${agent.name}`);
                  
                  return {
                    ...agent,
                    imageUrl: agent.avatar || generateAvatarUrl(agent),
                    traits: agent.traits && agent.traits.length > 0 
                      ? agent.traits 
                      : generateTraits(agent.category),
                    description: agent.expertise && agent.expertise.length > 0 
                      ? agent.expertise.join(", ") 
                      : generateDescription(agent.category),
                    rating: agent.averageRating 
                      ? (agent.averageRating / 100) // Divide by 100 if coming from contract 
                      : 4 + Math.random(),
                  };
                })
                .catch(error => {
                  // Check if the error indicates the agent doesn't exist
                  if (isAgentNotExistError(error)) {
                    console.log(`Agent ${i} does not exist, skipping`);
                  } else {
                    console.error(`Error fetching agent ${i}:`, error);
                  }
                  return null;
                })
            );
          }
          
          const batchResults = await Promise.all(batchPromises);
          validAgents.push(...batchResults.filter(agent => agent !== null) as EnhancedAgent[]);
          
          // Break early if we've found enough agents
          if (validAgents.length >= 8) {
            break;
          }
        }

        if (isMounted) {
          console.log(`Found ${validAgents.length} valid agents`);
          setAgents(validAgents);
          setFilteredAgents(validAgents);
          setIsLoadingAgents(false);
        }
      } catch (error) {
        console.error('Error in fetchAgents function:', error);
        if (isMounted) {
          setIsLoadingAgents(false);
        }
      }
    };

    fetchAgents();
    
    // Set a timeout to prevent indefinite loading (15 seconds)
    timeoutId = setTimeout(() => {
      if (isMounted && isLoadingAgents) {
        console.log('Loading timeout reached');
        setIsLoadingAgents(false);
      }
    }, 15000);
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array to ensure it only runs once

  // Check which agents the user has rented
  useEffect(() => {
    if (!isConnected || !address) return;
    
    try {
      if (userRentedAgentIds) {
        const ids = Array.isArray(userRentedAgentIds)
          ? userRentedAgentIds.map(id => Number(id))
          : [];
        
        setRentedAgentIds(ids);
      }
    } catch (error) {
      console.error("Error checking rented agents:", error);
    }
  }, [address, isConnected, userRentedAgentIds]);

  // Filter agents based on search term and categories
  useEffect(() => {
    if (!agents) return;
    
    // Filter out any agents with default names or that appear to be placeholder fallbacks
    const validAgents = agents.filter(agent => {
      // Filter out agents with generic "Agent X" names which indicate they don't really exist
      if (agent.name.match(/^Agent \d+$/)) return false;
      
      // Also filter out agents with no category or "Unknown" category
      if (!agent.category || agent.category === "Unknown") return false;
      
      return true;
    });
    
    // Now apply search and category filters to the valid agents
    const filtered = validAgents.filter(agent => {
      // Search term filter
      const matchesSearch = searchTerm === '' || 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(agent.category);
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredAgents(filtered);
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

  // Function to retry fetching
  const handleRetryFetch = () => {
    setHasAttemptedFetch(false);
  };

  return (
    <>
      <div className="text-center mb-12 pt-8">
        <motion.h1 
          className="text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          AI Agent Marketplace
        </motion.h1>
        <motion.p 
          className="text-gray-700 dark:text-white max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Browse and rent specialized AI agents for education, entertainment, business, or personal use
        </motion.p>
      </div>
      
      {/* Search and filters */}
      <motion.div 
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-10 border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="w-full md:w-2/3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for agents by name, traits, or description..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                  selectedCategories.includes(category)
                    ? 'bg-sei-blue text-white dark:bg-sei-light-blue dark:text-gray-900 font-semibold shadow-md'
                    : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white hover:bg-sei-light-blue/20 hover:text-sei-blue dark:hover:bg-sei-light-blue/20 dark:hover:text-sei-light-blue'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {isLoadingAgents && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
                  <div className="flex gap-1 mb-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Agent grid */}
      {!isLoadingAgents && agents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 transform hover:scale-[1.02]"
            >
              <div className="h-48 bg-gradient-to-r from-sei-blue/80 to-sei-purple dark:from-sei-light-blue/50 dark:to-sei-purple relative overflow-hidden">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // If image fails to load, set a fallback
                    const target = e.target as HTMLImageElement;
                    const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)];
                    target.src = `https://api.dicebear.com/7.x/${style}/svg?seed=${agent.name}-fallback`;
                    // Add custom styling to the fallback image
                    target.style.backgroundColor = 'rgba(30, 64, 175, 0.05)';
                    target.style.padding = '10px';
                  }}
                />
                <div className="absolute top-2 right-2">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full 
                    ${agent.category === 'Education' ? 'bg-blue-900 text-blue-300' : 
                      agent.category === 'Entertainment' ? 'bg-purple-900 text-purple-300' : 
                      agent.category === 'Business' ? 'bg-green-900 text-green-300' : 
                      'bg-orange-900 text-orange-300'}`}>
                    {agent.category}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(agent.rating) ? 'text-yellow-400' : 'text-gray-400'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="text-white text-xs ml-1">
                        {agent.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-white text-xs px-2 py-1 bg-black/30 rounded-full">
                      ID: {agent.id.toString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  {agent.name}
                </h3>
                <p className="text-gray-700 dark:text-white text-sm mb-4 line-clamp-2">
                  {agent.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  <span className="px-2 py-1 text-xs bg-sei-blue/10 text-sei-blue dark:bg-sei-blue/20 dark:text-sei-light-blue rounded-full">
                    {agent.category}
                  </span>
                  {agent.traits.map((trait, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-sei-light-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue rounded-full">
                      {trait}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sei-blue dark:text-sei-light-blue font-medium">
                    {formatEther(agent.rentalPricePerDay)} SEI/day
                  </div>
                  {rentedAgentIds.includes(agent.id) ? (
                    <Link href={`/agent/${agent.id}`}>
                      <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm">
                        Chat
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/agent/${agent.id}`}>
                      <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm">
                        Rent Now
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Empty state - when no agents were found */}
      {!isLoadingAgents && agents.length === 0 && (
        <motion.div 
          className="text-center py-16 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">No agents found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">No agents are currently available in the marketplace.</p>
          <button 
            onClick={handleRetryFetch}
            className="px-4 py-2 bg-sei-blue text-white dark:bg-sei-light-blue rounded-lg text-sm font-medium hover:bg-sei-blue/90 dark:hover:bg-sei-light-blue/90 transition-colors shadow-sm"
          >
            Retry Fetching Agents
          </button>
        </motion.div>
      )}
      
      {/* Empty search state - when agents exist but none match search/filter */}
      {!isLoadingAgents && agents.length > 0 && filteredAgents.length === 0 && (
        <motion.div 
          className="text-center py-16 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-white">No matching agents</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters.</p>
          {selectedCategories.length > 0 && (
            <button 
              onClick={() => setSelectedCategories([])}
              className="px-4 py-2 bg-sei-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue rounded-lg text-sm font-medium hover:bg-sei-blue/20 dark:hover:bg-sei-light-blue/30 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </motion.div>
      )}

      {/* Create agent CTA */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-sei-blue/10 to-sei-purple/10 dark:from-sei-light-blue/10 dark:to-sei-purple/10 p-8 rounded-xl border border-sei-light-blue/20">
          <h3 className="text-2xl font-bold mb-3 text-sei-blue dark:text-sei-light-blue">Create Your Own AI Agent</h3>
          <p className="mb-6 text-gray-700 dark:text-gray-300">Have a unique AI personality idea? Create and monetize your own custom AI agent on the Sei blockchain.</p>
          <Link href="/create">
            <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-8 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg">
              Start Creating
            </button>
          </Link>
        </div>
      </motion.div>
    </>
  );
}

export default function Marketplace() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-10">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="text-center py-16">
              <div className="animate-spin h-12 w-12 mx-auto rounded-full border-t-2 border-b-2 border-sei-red"></div>
              <p className="mt-4 text-sei-dark-gray">Loading marketplace...</p>
            </div>
          }>
            <MarketplaceContent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}