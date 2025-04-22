'use client';

import React, { useState } from 'react';
import { formatEther } from 'viem';
import Link from 'next/link';

interface AgentCardProps {
  id: number;
  name: string;
  category: string;
  avatar: string;
  rentalPricePerDay: bigint;
  creator: string;
  rating: number;
  totalRentals: number;
  isActive: boolean;
}

export default function AgentCard({
  id,
  name,
  category,
  avatar,
  rentalPricePerDay,
  creator,
  rating,
  totalRentals,
  isActive,
}: AgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getAvatarFallback = () => {
    return `https://avatars.dicebear.com/api/identicon/${name}.svg`;
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'education':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'entertainment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'business':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'personal':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-4 w-4 ${
              i < rating 
                ? 'text-yellow-400 animate-pulse-soft' 
                : 'text-gray-300 dark:text-gray-600'
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <Link href={`/agent/${id}`} className="block">
      <div 
        className={`card-hover gradient-border bg-white dark:bg-gray-800 rounded-lg overflow-hidden ${!isActive ? 'opacity-50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-48 bg-sei-light-gray dark:bg-gray-700 relative overflow-hidden">
          {/* Shiny effect overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${isHovered ? 'animate-shine' : ''} dark:via-gray-300`}></div>
          
          <img
            src={avatar || getAvatarFallback()}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = getAvatarFallback();
            }}
          />
          <div className="absolute top-2 right-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeColor(category)}`}>
              {category}
            </span>
          </div>
          
          {/* Glowing effect in dark mode */}
          <div className={`absolute inset-0 dark:bg-sei-red/5 dark:${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
        </div>
        <div className="p-4 relative">
          <h3 className="text-lg font-medium text-sei-dark-gray dark:text-white truncate dark:glow-text">{name}</h3>
          <div className="flex items-center mt-1">
            {renderStars(rating)}
            <span className="ml-1 text-xs text-sei-gray dark:text-gray-400">({totalRentals} rentals)</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-sei-red dark:text-sei-light-red font-semibold">{formatEther(rentalPricePerDay)} SEI</span>
              <span className="text-xs text-sei-gray dark:text-gray-400 ml-1">/ day</span>
            </div>
            <button className={`sei-button bg-sei-red hover:bg-sei-dark-red dark:bg-sei-light-red dark:hover:bg-sei-red text-white px-4 py-1.5 text-sm rounded-md ${isHovered ? 'scale-105' : ''}`}>
              Rent
            </button>
          </div>
          
          {/* Hover indicator line */}
          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-sei-light-red via-sei-red to-sei-dark-red transform scale-x-0 transition-transform duration-500 ${isHovered ? 'scale-x-100' : ''}`}></div>
        </div>
      </div>
    </Link>
  );
} 