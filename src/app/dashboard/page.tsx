'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Navbar from '@/components/Navbar';
import { useContract } from '@/hooks/useContract';
import Link from 'next/link';
import { formatEther } from 'viem';

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const {
    userCreatedAgentIds,
    userRentedAgentIds,
    isLoadingUserCreatedAgents,
    isLoadingUserRentedAgents,
  } = useContract();
  
  const [activeTab, setActiveTab] = useState('created');
  const [createdAgents, setCreatedAgents] = useState<any[]>([]);
  const [rentedAgents, setRentedAgents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for UI development
  const mockCreatedAgents = [
    {
      id: 1,
      name: 'Math Tutor Pro',
      category: 'Education',
      avatar: 'https://avatars.dicebear.com/api/bottts/mathtutor.svg',
      rentalPricePerDay: BigInt(0.1 * 10**18),
      totalEarnings: BigInt(1.5 * 10**18),
      totalRentals: 15,
      isActive: true,
    },
    {
      id: 2,
      name: 'Shakespeare Bot',
      category: 'Entertainment',
      avatar: 'https://avatars.dicebear.com/api/bottts/shakespeare.svg',
      rentalPricePerDay: BigInt(0.2 * 10**18),
      totalEarnings: BigInt(0.8 * 10**18),
      totalRentals: 4,
      isActive: true,
    },
  ];

  const mockRentedAgents = [
    {
      id: 3,
      name: 'Business Consultant',
      category: 'Business',
      avatar: 'https://avatars.dicebear.com/api/bottts/business.svg',
      rentalPricePerDay: BigInt(0.5 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      endDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
      isActive: true,
    },
    {
      id: 4,
      name: 'Fitness Coach',
      category: 'Personal',
      avatar: 'https://avatars.dicebear.com/api/bottts/fitness.svg',
      rentalPricePerDay: BigInt(0.15 * 10**18),
      creator: '0x1234567890abcdef1234567890abcdef12345678',
      endDate: new Date(Date.now() + 86400000 * 1), // 1 day from now
      isActive: true,
    },
  ];

  useEffect(() => {
    // In a real implementation, you would fetch data from the blockchain here
    // For now, we'll use the mock data for display purposes
    setCreatedAgents(mockCreatedAgents);
    setRentedAgents(mockRentedAgents);
    setIsLoading(false);
  }, []);

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-sei-offwhite">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-sei-dark-gray sm:text-4xl">
            Dashboard
          </h1>
          <p className="mt-4 text-lg text-sei-gray">
            Please connect your wallet to view your dashboard.
          </p>
          <div className="mt-8">
            <button className="sei-button px-6 py-3 rounded-md">
              Connect Wallet
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sei-offwhite">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-sei-red px-6 py-4">
            <h1 className="text-xl font-bold text-white">Dashboard</h1>
          </div>
          
          {/* Wallet Info */}
          <div className="border-b border-sei-light-gray">
            <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-medium text-sei-dark-gray">
                  Welcome Back
                </h2>
                <p className="text-sm text-sei-gray mt-1">
                  Connected Wallet: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
                </p>
              </div>
              <Link
                href="/create"
                className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red"
              >
                Create New Agent
              </Link>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-sei-light-gray">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('created')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'created'
                    ? 'border-sei-red text-sei-red'
                    : 'border-transparent text-sei-gray hover:text-sei-dark-gray hover:border-sei-gray'
                }`}
              >
                Your AI Agents
              </button>
              <button
                onClick={() => setActiveTab('rented')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'rented'
                    ? 'border-sei-red text-sei-red'
                    : 'border-transparent text-sei-gray hover:text-sei-dark-gray hover:border-sei-gray'
                }`}
              >
                Rented Agents
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="py-8 text-center">
                <svg className="animate-spin h-8 w-8 mx-auto text-sei-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-sei-dark-gray">Loading your data...</p>
              </div>
            ) : activeTab === 'created' ? (
              <div>
                {createdAgents.length > 0 ? (
                  <div className="overflow-hidden shadow-sm border border-sei-light-gray rounded-lg">
                    <table className="min-w-full divide-y divide-sei-light-gray">
                      <thead className="bg-sei-offwhite">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Agent
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Category
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Price/Day
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Earnings
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Rentals
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-sei-dark-gray uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-sei-light-gray">
                        {createdAgents.map((agent) => (
                          <tr key={agent.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-sei-light-gray overflow-hidden">
                                  <img 
                                    src={agent.avatar} 
                                    alt={agent.name}
                                    className="h-10 w-10 object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-sei-dark-gray">{agent.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                {agent.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-sei-dark-gray">
                              {formatEther(agent.rentalPricePerDay)} SEI
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-sei-dark-gray">
                              {formatEther(agent.totalEarnings)} SEI
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-sei-dark-gray">
                              {agent.totalRentals}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {agent.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/agent/${agent.id}`} className="text-sei-red hover:text-sei-dark-red mr-3">
                                View
                              </Link>
                              <Link href={`/agent/${agent.id}/edit`} className="text-sei-red hover:text-sei-dark-red">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sei-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-sei-dark-gray">No agents created</h3>
                    <p className="mt-1 text-sm text-sei-gray">Get started by creating your first AI agent</p>
                    <div className="mt-6">
                      <Link 
                        href="/create" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red"
                      >
                        Create New Agent
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {rentedAgents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rentedAgents.map((agent) => (
                      <div key={agent.id} className="bg-white rounded-lg shadow border border-sei-light-gray overflow-hidden">
                        <div className="h-32 bg-sei-light-gray relative">
                          <img 
                            src={agent.avatar} 
                            alt={agent.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {agent.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-sei-dark-gray">{agent.name}</h3>
                          <div className="mt-2 text-sm text-sei-gray">
                            <div className="flex justify-between items-center mb-1">
                              <span>Rental Price:</span>
                              <span className="font-medium text-sei-dark-gray">{formatEther(agent.rentalPricePerDay)} SEI/day</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Expires:</span>
                              <span className="font-medium text-sei-dark-gray">
                                {agent.endDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <Link 
                              href={`/agent/${agent.id}`} 
                              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red"
                            >
                              Chat with Agent
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sei-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-sei-dark-gray">No agents rented</h3>
                    <p className="mt-1 text-sm text-sei-gray">Browse the marketplace to find and rent AI agents</p>
                    <div className="mt-6">
                      <Link 
                        href="/marketplace" 
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red"
                      >
                        Browse Marketplace
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 