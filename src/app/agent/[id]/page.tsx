'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAccount } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { formatEther, parseEther } from 'viem';
import Link from 'next/link';

export default function AgentDetail() {
  const params = useParams();
  const agentId = Number(params.id);
  const { address, isConnected } = useAccount();
  const { rentAgent, rateAgent, hasActiveRental, isPending, isConfirming } = useContract();

  const [agent, setAgent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRented, setIsRented] = useState(false);
  const [rentalDays, setRentalDays] = useState(1);
  const [userRating, setUserRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'agent'; content: string }[]>([]);
  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Mock data for UI development
  const mockAgent = {
    id: agentId,
    name: 'Math x Fun',
    category: 'Education',
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=Math%20x%20Fun`,
    traits: ['Patient', 'Encouraging', 'Detailed'],
    expertise: ['Algebra', 'Calculus', 'Geometry', 'Statistics'],
    creator: '0x2ec8175015Bef5ad1C0BE1587C4A377bC083A2d8',
    rentalPricePerDay: BigInt(0.1 * 10**18),
    totalEarnings: BigInt(1.5 * 10**18),
    totalRentals: 124,
    rating: 4.5,
    numberOfRatings: 78,
    isActive: true,
  };

  useEffect(() => {
    // In a real implementation, you would fetch data from the blockchain here
    // For now, we'll use mock data
    setAgent(mockAgent);
    setIsLoading(false);
    
    // Check if user has rented this agent (mock implementation)
    if (isConnected) {
      setIsRented(Math.random() > 0.5);
    }
  }, [agentId, isConnected]);

  const handleRent = () => {
    if (!isConnected) {
      alert('Please connect your wallet to rent this agent');
      return;
    }
    
    try {
      rentAgent(
        agentId, 
        rentalDays, 
        agent.rentalPricePerDay
      );
    } catch (error) {
      console.error('Error renting agent:', error);
    }
  };

  const submitRating = (rating: number) => {
    if (!isConnected || !isRented) {
      return;
    }
    
    try {
      rateAgent(agentId, rating);
      setUserRating(rating);
      setShowRatingModal(false);
    } catch (error) {
      console.error('Error rating agent:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !isRented) return;
    
    setIsSendingMessage(true);
    const userMessage = { role: 'user' as const, content: message };
    setChatMessages([...chatMessages, userMessage]);
    setMessage('');
    
    // Simulate AI response after delay
    setTimeout(() => {
      const agentResponse = { 
        role: 'agent' as const, 
        content: `I'm ${agent.name}, your AI assistant. This is a simulated response. In a real implementation, this would use the Gemini API to generate a response based on the agent's traits and expertise.` 
      };
      setChatMessages(prev => [...prev, agentResponse]);
      setIsSendingMessage(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-sei-offwhite">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin h-12 w-12 mx-auto rounded-full border-t-2 border-b-2 border-sei-red"></div>
          <p className="mt-4 text-sei-dark-gray">Loading agent details...</p>
        </div>
      </main>
    );
  }

  if (!agent) {
    return (
      <main className="min-h-screen bg-sei-offwhite">
        <Navbar />
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-sei-dark-gray sm:text-4xl">
            Agent Not Found
          </h1>
          <p className="mt-4 text-lg text-sei-gray">
            The AI agent you're looking for doesn't exist or has been deactivated.
          </p>
          <div className="mt-8">
            <Link 
              href="/marketplace" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sei-red hover:bg-sei-dark-red"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sei-offwhite">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-sei-light-gray relative">
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
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-sei-dark-gray">{agent.name}</h1>
                
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(agent.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-sei-gray">
                    {agent.rating.toFixed(1)} ({agent.numberOfRatings} reviews)
                  </span>
                </div>
                
                <div className="mt-6">
                  <h2 className="text-sm font-medium text-sei-dark-gray">Personality Traits</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.traits.map((trait: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <h2 className="text-sm font-medium text-sei-dark-gray">Areas of Expertise</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {agent.expertise.map((exp: string, index: number) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-sei-light-gray">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-sei-red">{formatEther(agent.rentalPricePerDay)} SEI</p>
                      <p className="text-sm text-sei-gray">per day</p>
                    </div>
                    
                    {!isRented ? (
                      <div className="flex items-center">
                        <select
                          value={rentalDays}
                          onChange={(e) => setRentalDays(Number(e.target.value))}
                          className="mr-2 block border border-sei-light-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm"
                        >
                          {[1, 3, 7, 14, 30].map((days) => (
                            <option key={days} value={days}>{days} day{days > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                        <button
                          onClick={handleRent}
                          disabled={isPending || isConfirming}
                          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red ${
                            (isPending || isConfirming) 
                              ? 'opacity-70 cursor-not-allowed' 
                              : 'hover:bg-sei-dark-red'
                          }`}
                        >
                          {isPending || isConfirming ? 'Processing...' : 'Rent Now'}
                        </button>
                      </div>
                    ) : userRating === 0 ? (
                      <button
                        onClick={() => setShowRatingModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-sei-light-gray rounded-md shadow-sm text-sm font-medium text-sei-dark-gray hover:bg-sei-light-gray"
                      >
                        Rate Agent
                      </button>
                    ) : (
                      <div className="flex items-center">
                        <span className="text-sm text-sei-gray mr-2">Your rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${
                                i < userRating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
              <div className="bg-sei-red px-6 py-4">
                <h2 className="text-xl font-bold text-white">Chat with {agent.name}</h2>
              </div>
              
              {isRented ? (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-10">
                        <div className="mb-4 relative w-24 h-24 mx-auto">
                          <img
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-full h-full object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-lg"
                          />
                          <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-400 rounded-full border-2 border-white dark:border-gray-700"></div>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Start chatting with {agent.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Specialized in {agent.expertise.join(", ")}
                        </p>
                        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
                          {["How can you help me with math?", "Explain a difficult concept", "Can you solve a problem?", "Tell me about yourself"].map((suggestion, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setMessage(suggestion);
                                setTimeout(() => handleSendMessage(), 100);
                              }}
                              className="px-3 py-2 text-sm bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {chatMessages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      >
                        {msg.role === 'agent' && (
                          <div className="flex-shrink-0 mr-3">
                            <img 
                              src={agent.avatar}
                              alt={agent.name}
                              className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                            />
                          </div>
                        )}
                        <div 
                          className={`max-w-xs sm:max-w-md rounded-2xl p-4 ${
                            msg.role === 'user' 
                              ? 'bg-blue-600 text-white rounded-tr-none' 
                              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600 rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="flex-shrink-0 ml-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-gray-600 flex items-center justify-center text-blue-600 dark:text-blue-300 font-medium">
                              {address ? address.slice(0, 2) : 'Me'}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isSendingMessage && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="flex-shrink-0 mr-3">
                          <img 
                            src={agent.avatar}
                            alt={agent.name}
                            className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-700"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-md rounded-2xl p-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm border border-gray-200 dark:border-gray-600 rounded-tl-none">
                          <div className="flex space-x-2">
                            <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-400 animate-pulse"></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 block border border-gray-300 dark:border-gray-600 rounded-l-lg shadow-sm py-3 px-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleSendMessage();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || isSendingMessage}
                        className={`inline-flex items-center px-4 py-3 border border-transparent rounded-r-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${
                          !message.trim() || isSendingMessage
                            ? 'opacity-70 cursor-not-allowed'
                            : ''
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span>{agent.name} is online and ready to assist</span>
                      </div>
                      <div>
                        <span>Powered by SeiForge AI</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-6">
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-sei-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-sei-dark-gray">Chat locked</h3>
                    <p className="mt-1 text-sm text-sei-gray">Rent this AI agent to start chatting</p>
                    <div className="mt-6">
                      <button
                        onClick={handleRent}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red"
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-sei-dark-gray">
                      Rate {agent.name}
                    </h3>
                    <div className="mt-4">
                      <div className="flex items-center justify-center">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => submitRating(rating)}
                            className="mx-1 focus:outline-none"
                          >
                            <svg
                              className={`h-8 w-8 ${
                                rating <= userRating ? 'text-yellow-400' : 'text-gray-300'
                              } hover:text-yellow-400`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                              onMouseEnter={() => setUserRating(rating)}
                              onMouseLeave={() => setUserRating(0)}
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-sei-offwhite px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowRatingModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-sei-red text-base font-medium text-white hover:bg-sei-dark-red focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}