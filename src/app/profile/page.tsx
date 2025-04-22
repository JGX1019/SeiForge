'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/app/ThemeProvider';
import { useContract } from '@/hooks/useContract';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
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

export default function Profile() {
  const { theme = 'light' } = useTheme();
  const { address, isConnected } = useAccount();
  const { userCreatedAgentIds, userRentedAgentIds, isLoadingUserCreatedAgents, isLoadingUserRentedAgents } = useContract();
  
  const [activeTab, setActiveTab] = useState('created');
  const [createdAgents, setCreatedAgents] = useState<Agent[]>([]);
  const [rentedAgents, setRentedAgents] = useState<Agent[]>([]);
  
  // Simulate fetching agent data based on IDs
  useEffect(() => {
    // In a real implementation, you would fetch full agent data using the IDs
    // For now, we'll create placeholders
    if (!isLoadingUserCreatedAgents && userCreatedAgentIds) {
      const mockCreatedAgents = Object.keys(userCreatedAgentIds).map((id, index) => ({
        id: parseInt(id),
        name: `My Agent ${index + 1}`,
        description: "This is an AI agent I created on SeiForge",
        creator: address || '',
        price: BigInt(0.1 * 10**18),
        imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=agent${id}`,
        rating: 4.5,
        traits: ['Friendly', 'Helpful']
      }));
      setCreatedAgents(mockCreatedAgents);
    }
    
    if (!isLoadingUserRentedAgents && userRentedAgentIds) {
      const mockRentedAgents = Object.keys(userRentedAgentIds).map((id, index) => ({
        id: parseInt(id),
        name: `Rented Agent ${index + 1}`,
        description: "This is an AI agent I'm currently renting",
        creator: '0x' + '1'.repeat(40),
        price: BigInt(0.2 * 10**18),
        imageUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=rented${id}`,
        rating: 4.2,
        traits: ['Intelligent', 'Creative']
      }));
      setRentedAgents(mockRentedAgents);
    }
  }, [address, userCreatedAgentIds, userRentedAgentIds, isLoadingUserCreatedAgents, isLoadingUserRentedAgents]);
  
  const renderAgentList = (agents: Agent[], isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mt-6"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (agents.length === 0) {
      return (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            {activeTab === 'created' ? 'No Created Agents' : 'No Rented Agents'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            {activeTab === 'created' 
              ? "You haven't created any AI agents yet. Create your first agent now!" 
              : "You haven't rented any AI agents yet. Explore the marketplace to find agents."}
          </p>
          <Link href={activeTab === 'created' ? '/create' : '/marketplace'}>
            <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
              {activeTab === 'created' ? 'Create Agent' : 'Explore Marketplace'}
            </button>
          </Link>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
          >
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
                    ID: {agent.id}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {agent.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                {agent.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {agent.traits.map((trait, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-sei-light-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sei-blue dark:text-sei-light-blue font-medium">
                  {formatEther(agent.price)} SEI
                </div>
                <Link href={`/agent/${agent.id}`}>
                  <button className="bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                    {activeTab === 'created' ? 'Manage' : 'Chat'}
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };
  
  if (!isConnected) {
    return (
      <main className="min-h-screen bg-white dark:bg-gray-900">
        <Navbar />
        <div className="pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-2xl font-bold mb-4 text-gray-700 dark:text-gray-300">
                Connect Your Wallet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Connect your wallet to view your profile, created agents, and active rentals.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Click the connect button in the top right corner
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Profile header */}
            <div className="bg-gradient-to-r from-sei-blue to-sei-purple dark:from-sei-light-blue dark:to-sei-purple rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="px-6 py-10 sm:px-10 sm:py-16">
                <div className="flex flex-col sm:flex-row items-center">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 mr-6 mb-4 sm:mb-0">
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden">
                      <img 
                        src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} 
                        alt="User avatar" 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      My Profile
                    </h1>
                    <p className="text-white/80 text-sm sm:text-base mb-4 break-all">
                      {address}
                    </p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-white">
                      <div>
                        <div className="text-xl font-medium">{Object.keys(userCreatedAgentIds || {}).length}</div>
                        <div className="text-sm text-white/80">Created Agents</div>
                      </div>
                      <div>
                        <div className="text-xl font-medium">{Object.keys(userRentedAgentIds || {}).length}</div>
                        <div className="text-sm text-white/80">Rented Agents</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex">
                  <button
                    onClick={() => setActiveTab('created')}
                    className={`py-4 px-6 text-sm font-medium ${
                      activeTab === 'created'
                        ? 'border-b-2 border-sei-blue dark:border-sei-light-blue text-sei-blue dark:text-sei-light-blue'
                        : 'text-gray-500 dark:text-gray-400 hover:text-sei-blue dark:hover:text-sei-light-blue'
                    }`}
                  >
                    My Created Agents
                  </button>
                  <button
                    onClick={() => setActiveTab('rented')}
                    className={`py-4 px-6 text-sm font-medium ${
                      activeTab === 'rented'
                        ? 'border-b-2 border-sei-blue dark:border-sei-light-blue text-sei-blue dark:text-sei-light-blue'
                        : 'text-gray-500 dark:text-gray-400 hover:text-sei-blue dark:hover:text-sei-light-blue'
                    }`}
                  >
                    My Rented Agents
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Agents list */}
            <div className="pb-10">
              {activeTab === 'created' 
                ? renderAgentList(createdAgents, isLoadingUserCreatedAgents)
                : renderAgentList(rentedAgents, isLoadingUserRentedAgents)
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 