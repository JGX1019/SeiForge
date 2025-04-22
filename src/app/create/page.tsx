'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/app/ThemeProvider';
import { useContract } from '@/hooks/useContract';
import { parseEther } from 'viem';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CreateAgent() {
  const { theme = 'light' } = useTheme();
  const router = useRouter();
  const { createAgent } = useContract();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [traits, setTraits] = useState<string[]>([]);
  const [expertise, setExpertise] = useState<string[]>([]);
  const [price, setPrice] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [traitInput, setTraitInput] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  
  const categories = ['Education', 'Entertainment', 'Business', 'Personal'];
  
  const handleTraitAdd = () => {
    if (traitInput.trim() !== '' && !traits.includes(traitInput.trim())) {
      setTraits([...traits, traitInput.trim()]);
      setTraitInput('');
    }
  };
  
  const handleExpertiseAdd = () => {
    if (expertiseInput.trim() !== '' && !expertise.includes(expertiseInput.trim())) {
      setExpertise([...expertise, expertiseInput.trim()]);
      setExpertiseInput('');
    }
  };
  
  const handleRemoveTrait = (trait: string) => {
    setTraits(traits.filter(t => t !== trait));
  };
  
  const handleRemoveExpertise = (exp: string) => {
    setExpertise(expertise.filter(e => e !== exp));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || traits.length === 0 || expertise.length === 0) {
      alert('Please fill all required fields');
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Random avatar for now - in a real app, you'd want to let users upload their own
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;
      
      // Convert price from human-readable to wei format
      const priceInWei = price ? parseEther(price) : parseEther('0');
      
      await createAgent(
        name,
        category,
        avatarUrl,
        traits,
        expertise,
        priceInWei
      );
      
      // Redirect to marketplace after successful creation
      router.push('/marketplace');
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Failed to create agent. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 pt-8">
              <h1 className="text-4xl font-bold mb-4 text-sei-blue dark:text-sei-light-blue">
                Create Your AI Agent
              </h1>
              <p className="text-gray-700 dark:text-white">
                Design a custom AI personality that others can rent on the marketplace
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Agent Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Math Tutor Pro"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                      required
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe what your AI agent does and what makes it special..."
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                      required
                    />
                  </div>
                  
                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Category*
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Traits */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Traits* (at least one)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={traitInput}
                        onChange={(e) => setTraitInput(e.target.value)}
                        placeholder="e.g., Friendly, Patient, Technical"
                        className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTraitAdd())}
                      />
                      <button
                        type="button"
                        onClick={handleTraitAdd}
                        className="px-4 py-2 bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple rounded-r-lg transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {traits.map((trait) => (
                        <span
                          key={trait}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sei-light-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue"
                        >
                          {trait}
                          <button
                            type="button"
                            onClick={() => handleRemoveTrait(trait)}
                            className="ml-1 rounded-full text-sei-blue dark:text-sei-light-blue hover:text-sei-purple dark:hover:text-white"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Expertise */}
                  <div>
                    <label className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Expertise* (at least one)
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={expertiseInput}
                        onChange={(e) => setExpertiseInput(e.target.value)}
                        placeholder="e.g., Mathematics, Python, Customer Service"
                        className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleExpertiseAdd())}
                      />
                      <button
                        type="button"
                        onClick={handleExpertiseAdd}
                        className="px-4 py-2 bg-sei-blue hover:bg-sei-purple text-white dark:bg-sei-light-blue dark:hover:bg-sei-purple rounded-r-lg transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {expertise.map((exp) => (
                        <span
                          key={exp}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-sei-light-blue/10 text-sei-blue dark:bg-sei-light-blue/20 dark:text-sei-light-blue"
                        >
                          {exp}
                          <button
                            type="button"
                            onClick={() => handleRemoveExpertise(exp)}
                            className="ml-1 rounded-full text-sei-blue dark:text-sei-light-blue hover:text-sei-purple dark:hover:text-white"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-800 dark:text-white mb-1">
                      Daily Rental Price (SEI)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="price"
                        value={price}
                        onChange={(e) => {
                          // Allow only valid number inputs
                          const value = e.target.value;
                          if (value === '' || /^\d*\.?\d*$/.test(value)) {
                            setPrice(value);
                          }
                        }}
                        placeholder="0.1"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sei-blue dark:focus:ring-sei-light-blue"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500 dark:text-gray-400">SEI</span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">
                      Leave empty for a free agent
                    </p>
                  </div>
                  
                  {/* Submit button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isCreating}
                      className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors duration-200 shadow-md ${
                        isCreating
                          ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                          : 'bg-sei-blue hover:bg-sei-purple dark:bg-sei-light-blue dark:hover:bg-sei-purple'
                      }`}
                    >
                      {isCreating ? 'Creating...' : 'Create Agent'}
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
} 