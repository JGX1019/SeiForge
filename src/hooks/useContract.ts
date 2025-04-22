import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SeiForgeABI, SeiForgeAddress } from '@/config/contract';
import { zeroAddress } from 'viem';
import { parseEther } from 'viem';

export interface Agent {
  id: number;
  name: string;
  category: string;
  avatar: string;
  creator: string;
  rentalPricePerDay: bigint;
  totalEarnings: bigint;
  totalRentals: number;
  averageRating: number;
  isActive: boolean;
}

export function useContract() {
  const { address } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Get all agents
  const { data: totalAgents, isLoading: isLoadingTotalAgents } = useReadContract({
    address: SeiForgeAddress,
    abi: SeiForgeABI,
    functionName: 'getTotalAgents',
    query: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  });

  // Get user's created agents
  const { data: userCreatedAgentIds, isLoading: isLoadingUserCreatedAgents } = useReadContract({
    address: SeiForgeAddress,
    abi: SeiForgeABI,
    functionName: 'getCreatorAgents',
    args: address ? [address] : undefined,
    query: {
      staleTime: 1000 * 60 * 5,
      enabled: !!address
    }
  });

  // Get user's rented agents
  const { data: userRentedAgentIds, isLoading: isLoadingUserRentedAgents } = useReadContract({
    address: SeiForgeAddress,
    abi: SeiForgeABI,
    functionName: 'getUserRentedAgents',
    args: address ? [address] : undefined,
    query: {
      staleTime: 1000 * 60 * 5,
      enabled: !!address
    }
  });

  // Create a new agent
  const createAgent = (
    name: string,
    category: string,
    avatar: string,
    traits: string[],
    expertise: string[],
    rentalPricePerDay: bigint
  ) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'createAgent',
      args: [name, category, avatar, traits, expertise, rentalPricePerDay],
      value: BigInt(5 * 10**17), // 0.5 SEI creation fee
    });
  };

  // Rent an agent
  const rentAgent = (agentId: number, durationDays: number, price: bigint) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'rentAgent',
      args: [agentId, durationDays],
      value: price * BigInt(durationDays),
    });
  };

  // Rate an agent
  const rateAgent = (agentId: number, rating: number) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'rateAgent',
      args: [agentId, rating],
    });
  };

  // Update rental price
  const updateRentalPrice = (agentId: number, newPrice: bigint) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'updateRentalPrice',
      args: [agentId, newPrice],
    });
  };

  // Deactivate agent
  const deactivateAgent = (agentId: number) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'deactivateAgent',
      args: [agentId],
    });
  };

  // Reactivate agent
  const reactivateAgent = (agentId: number) => {
    writeContract({
      address: SeiForgeAddress,
      abi: SeiForgeABI,
      functionName: 'reactivateAgent',
      args: [agentId],
    });
  };

  // Get agent details by ID (modified to map contract data structure correctly)
  const getAgentDetails = async (agentId: number): Promise<Agent | null> => {
    try {
      // Based on the contract structure, agent IDs start from 0 not 1
      // This is a simplified mock for the UI
      // In a real implementation, you would use a proper RPC call to the contract
      
      // Sample agent data based on the contract structure
      const styles = ['bottts', 'pixel-art', 'shapes', 'identicon', 'micah'];
      const randomStyle = styles[agentId % styles.length];
      
      // Sample agent names and categories based on agent ID
      const sampleNames = [
        "Math x Fun",
        "History Explorer",
        "Business Advisor",
        "Fitness Coach",
        "Language Tutor",
        "Sci-Fi Storyteller"
      ];
      
      const sampleCategories = ["Education", "Entertainment", "Business", "Personal"];
      
      const mockAgentData = {
        id: agentId,
        name: sampleNames[agentId % sampleNames.length],
        category: sampleCategories[agentId % sampleCategories.length],
        avatar: `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(sampleNames[agentId % sampleNames.length])}`,
        creator: '0x2ec8175015Bef5ad1C0BE1587C4A377bC083A2d8',
        rentalPricePerDay: BigInt(1 * 10**17), // 0.1 SEI
        totalEarnings: BigInt(agentId * 0.05 * 10**18),
        totalRentals: agentId * 5,
        averageRating: 3 + (agentId % 3),
        isActive: true
      };
      
      return mockAgentData;
    } catch (error) {
      console.error('Error fetching agent details', error);
      return null;
    }
  };

  // Check if user has active rental
  const hasActiveRental = (userId: string, agentId: number): boolean => {
    // Mock implementation for UI development
    return Math.random() > 0.5;
  };

  return {
    totalAgents: Number(totalAgents || 0),
    userCreatedAgentIds: userCreatedAgentIds || [],
    userRentedAgentIds: userRentedAgentIds || [],
    isLoadingTotalAgents,
    isLoadingUserCreatedAgents,
    isLoadingUserRentedAgents,
    createAgent,
    rentAgent,
    rateAgent,
    updateRentalPrice,
    deactivateAgent,
    reactivateAgent,
    getAgentDetails,
    hasActiveRental,
    isPending,
    isConfirming,
    isConfirmed,
    error,
  };
}