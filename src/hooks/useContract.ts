import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { SeiForgeABI, SeiForgeAddress } from '@/config/contract';
import { zeroAddress } from 'viem';
import { parseEther } from 'viem';
import { ethers } from 'ethers';
import { seiTestnet } from '@/config/chains';

// Create ethers provider and contract instance
const provider = new ethers.JsonRpcProvider(seiTestnet.rpcUrls.default.http[0]);
const contract = new ethers.Contract(SeiForgeAddress, SeiForgeABI, provider);

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
  traits?: string[];
  expertise?: string[];
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

  // Get agent details by ID - Now using ethers.js
  const getAgentDetails = async (agentId: number): Promise<Agent | null> => {
    try {
      console.log('Fetching agent details for ID:', agentId);
      
      // Get agent details from contract using ethers.js
      const agentDetails = await contract.getAgentDetails(agentId);
      
      // Check if we got a valid response
      if (!agentDetails) {
        console.log('No agent details found for ID:', agentId);
        return null;
      }
      
      console.log('Raw agent details:', agentDetails);
      
      // Now we'll handle the response differently based on what ethers.js returns
      // With ethers.js, the result might be an array or an object with named properties
      let name, category, avatar, creator, rentalPricePerDay, totalEarnings, totalRentals, isActive;
      
      if (Array.isArray(agentDetails)) {
        // If it's an array, we'll destructure it based on the contract function's return values
        [name, category, avatar, creator, rentalPricePerDay, totalEarnings, totalRentals, isActive] = agentDetails;
      } else {
        // If it's an object with named properties
        ({ name, category, avatar, creator, rentalPricePerDay, totalEarnings, totalRentals, isActive } = agentDetails);
      }
      
      // Check if this is a valid agent or just a placeholder with a default name
      if (!name || name.match(/^Agent \d+$/)) {
        console.log('Skipping agent with default name:', name);
        return null;
      }
      
      // Get the agent rating separately (since it's not part of getAgentDetails)
      const ratingInfo = await contract.getAgentRating(agentId);
      const averageRating = ratingInfo ? Number(ratingInfo.averageRating || 0) : 0;
      
      // Try to fetch traits and expertise (these might not be in the getAgentDetails call)
      let traits: string[] = [];
      let expertise: string[] = [];
      
      try {
        // Try to get the raw agent data from aiAgents mapping to get more info
        const rawAgent = await contract.aiAgents(agentId);
        if (rawAgent) {
          // Note: traits and expertise might not be accessible through this API
          // We'll use default values if not available
        }
      } catch (e) {
        console.log('Could not fetch additional agent data, using defaults');
      }
      
      // Create an Agent object from the retrieved data
      const agent: Agent = {
        id: agentId,
        name: name || `Agent ${agentId}`,
        category: category || "Unknown",
        avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=agent-${agentId}`,
        creator: creator || zeroAddress,
        rentalPricePerDay: BigInt(rentalPricePerDay?.toString() || "0"),
        totalEarnings: BigInt(totalEarnings?.toString() || "0"),
        totalRentals: Number(totalRentals || 0),
        averageRating,
        isActive: Boolean(isActive),
        traits,
        expertise
      };
      
      return agent;
    } catch (error) {
      console.error('Error fetching agent details from contract:', error);
      
      // For other errors, provide a minimal fallback that will be filtered out by name check
      return null;
    }
  };

  // Check if user has active rental and get rental details - Now using ethers.js
  const hasActiveRental = async (userId: string, agentId: number): Promise<{
    hasRental: boolean;
    rentalEndTime?: number;
    remainingDays?: number;
  }> => {
    try {
      // Check if the user has an active rental for this agent
      const hasRental = await contract.hasActiveRental(userId, agentId);
      
      if (hasRental) {
        // Get active rentals for this agent
        const rentals = await contract.getActiveRentals(agentId);
        
        // Find the rental for this specific user
        const userRental = rentals.find((rental: any) => 
          rental.renter.toLowerCase() === userId.toLowerCase() && rental.isActive
        );
        
        if (userRental) {
          const currentTime = Math.floor(Date.now() / 1000);
          const endTime = Number(userRental.endTime);
          const remainingDays = Math.ceil((endTime - currentTime) / 86400);
          
          return {
            hasRental: true,
            rentalEndTime: endTime,
            remainingDays: remainingDays > 0 ? remainingDays : 0
          };
        }
      }
      
      return { hasRental: false };
    } catch (error) {
      console.error('Error checking rental status from contract:', error);
      return { hasRental: false };
    }
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