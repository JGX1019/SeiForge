'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import AgentCard from '@/components/AgentCard';
import { useContract } from '@/hooks/useContract';

const categories = ['All', 'Education', 'Entertainment', 'Business', 'Personal'];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedAgents, setDisplayedAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulated agents for UI preview
  const mockAgents = [
    {
      id: 1,
      name: 'Math Tutor Pro',
      category: 'Education',
      avatar: 'https://avatars.dicebear.com/api/bottts/mathtutor.svg',
      rentalPricePerDay: BigInt(0.1 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 4.5,
      totalRentals: 124,
      isActive: true,
    },
    {
      id: 2,
      name: 'Shakespeare Bot',
      category: 'Entertainment',
      avatar: 'https://avatars.dicebear.com/api/bottts/shakespeare.svg',
      rentalPricePerDay: BigInt(0.2 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 4.2,
      totalRentals: 87,
      isActive: true,
    },
    {
      id: 3,
      name: 'Business Consultant',
      category: 'Business',
      avatar: 'https://avatars.dicebear.com/api/bottts/business.svg',
      rentalPricePerDay: BigInt(0.5 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 4.8,
      totalRentals: 56,
      isActive: true,
    },
    {
      id: 4,
      name: 'Fitness Coach',
      category: 'Personal',
      avatar: 'https://avatars.dicebear.com/api/bottts/fitness.svg',
      rentalPricePerDay: BigInt(0.15 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 4.6,
      totalRentals: 92,
      isActive: true,
    },
    {
      id: 5,
      name: 'Science Teacher',
      category: 'Education',
      avatar: 'https://avatars.dicebear.com/api/bottts/science.svg',
      rentalPricePerDay: BigInt(0.12 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 4.3,
      totalRentals: 73,
      isActive: true,
    },
    {
      id: 6,
      name: 'Comedian AI',
      category: 'Entertainment',
      avatar: 'https://avatars.dicebear.com/api/bottts/comedian.svg',
      rentalPricePerDay: BigInt(0.18 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      rating: 3.9,
      totalRentals: 112,
      isActive: true,
    },
  ];

  useEffect(() => {
    // Filter agents based on category and search term
    let filteredAgents = mockAgents;
    
    if (selectedCategory !== 'All') {
      filteredAgents = filteredAgents.filter(agent => 
        agent.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    if (searchTerm) {
      filteredAgents = filteredAgents.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setDisplayedAgents(filteredAgents);
    setIsLoading(false);
  }, [selectedCategory, searchTerm]);

  return (
    <main className="min-h-screen bg-sei-offwhite">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Marketplace Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-sei-dark-gray sm:text-4xl">
            AI Personality Marketplace
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-sei-gray sm:mt-4">
            Browse and rent specialized AI agents created by our community
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative rounded-md shadow-sm w-full md:w-auto">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search AI agents..."
              className="block w-full md:w-80 pl-10 pr-3 py-2 border border-sei-light-gray rounded-md focus:outline-none focus:ring-2 focus:ring-sei-red focus:border-sei-red sm:text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sei-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto py-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-sei-red text-white'
                    : 'bg-white text-sei-dark-gray hover:bg-sei-light-gray'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        
        {/* Agent Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden h-80">
                <div className="h-48 bg-sei-light-gray"></div>
                <div className="p-4">
                  <div className="h-4 bg-sei-light-gray rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-sei-light-gray rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : displayedAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                category={agent.category}
                avatar={agent.avatar}
                rentalPricePerDay={agent.rentalPricePerDay}
                creator={agent.creator}
                rating={agent.rating}
                totalRentals={agent.totalRentals}
                isActive={agent.isActive}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-sei-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-sei-dark-gray">No agents found</h3>
            <p className="mt-2 text-sei-gray">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </main>
  );
} 