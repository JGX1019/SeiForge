'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAccount } from 'wagmi';
import { useContract } from '@/hooks/useContract';
import { parseEther } from 'viem';

const categories = ['Education', 'Entertainment', 'Business', 'Personal'];

export default function CreateAgent() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { createAgent, isPending, isConfirming, isConfirmed, error } = useContract();
  
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    avatar: '',
    traits: [''],
    expertise: [''],
    rentalPricePerDay: '0.1',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const handleArrayChange = (index: number, value: string, field: 'traits' | 'expertise') => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };
  
  const addArrayItem = (field: 'traits' | 'expertise') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };
  
  const removeArrayItem = (index: number, field: 'traits' | 'expertise') => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData({ ...formData, [field]: newArray });
    }
  };
  
  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 3) {
        newErrors.name = 'Name must be at least 3 characters long';
      }
      
      if (!formData.avatar.trim()) {
        newErrors.avatar = 'Avatar URL is required';
      }
    }
    
    if (currentStep === 2) {
      for (let i = 0; i < formData.traits.length; i++) {
        if (!formData.traits[i].trim()) {
          newErrors[`trait-${i}`] = 'Trait cannot be empty';
        }
      }
      
      for (let i = 0; i < formData.expertise.length; i++) {
        if (!formData.expertise[i].trim()) {
          newErrors[`expertise-${i}`] = 'Expertise cannot be empty';
        }
      }
    }
    
    if (currentStep === 3) {
      if (!formData.rentalPricePerDay) {
        newErrors.rentalPricePerDay = 'Rental price is required';
      } else if (parseFloat(formData.rentalPricePerDay) <= 0) {
        newErrors.rentalPricePerDay = 'Rental price must be greater than zero';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(step)) {
      return;
    }
    
    if (!isConnected) {
      setErrors({ wallet: 'Please connect your wallet to create an agent' });
      return;
    }
    
    setIsSubmitting(true);
    try {
      createAgent(
        formData.name,
        formData.category,
        formData.avatar,
        formData.traits.filter(t => t.trim()),
        formData.expertise.filter(e => e.trim()),
        parseEther(formData.rentalPricePerDay)
      );
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create agent' });
      setIsSubmitting(false);
    }
  };
  
  // Redirect after successful creation
  if (isConfirmed) {
    router.push('/dashboard');
  }
  
  return (
    <main className="min-h-screen bg-sei-offwhite">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-sei-red px-6 py-4">
            <h1 className="text-xl font-bold text-white">Create AI Agent</h1>
          </div>
          
          {/* Progress Indicator */}
          <div className="px-6 pt-6">
            <div className="flex justify-between mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= i 
                        ? 'bg-sei-red text-white' 
                        : 'bg-sei-light-gray text-sei-gray'
                    }`}
                  >
                    {i}
                  </div>
                  <span className="text-xs mt-1 text-sei-gray">
                    {i === 1 ? 'Basics' : i === 2 ? 'Traits' : 'Pricing'}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="w-full bg-sei-light-gray h-1 rounded-full">
              <div 
                className="bg-sei-red h-1 rounded-full transition-all duration-300"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* Form Steps */}
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-sei-dark-gray">
                    Agent Name <span className="text-sei-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.name ? 'border-red-500' : 'border-sei-light-gray'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm`}
                    placeholder="Enter a unique name for your AI agent"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-sei-dark-gray">
                    Category <span className="text-sei-red">*</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-sei-light-gray rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="avatar" className="block text-sm font-medium text-sei-dark-gray">
                    Avatar URL <span className="text-sei-red">*</span>
                  </label>
                  <input
                    type="text"
                    id="avatar"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${errors.avatar ? 'border-red-500' : 'border-sei-light-gray'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm`}
                    placeholder="https://example.com/avatar.png"
                  />
                  {errors.avatar && <p className="mt-1 text-sm text-red-500">{errors.avatar}</p>}
                  <p className="mt-1 text-xs text-sei-gray">Provide an image URL for your agent's avatar</p>
                </div>
              </div>
            )}
            
            {/* Step 2: Traits and Expertise */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="traits" className="block text-sm font-medium text-sei-dark-gray">
                      Personality Traits <span className="text-sei-red">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('traits')}
                      className="text-sm text-sei-red hover:text-sei-dark-red"
                    >
                      + Add Trait
                    </button>
                  </div>
                  <p className="text-xs text-sei-gray mb-2">These traits will define your agent's personality</p>
                  
                  {formData.traits.map((trait, index) => (
                    <div key={`trait-${index}`} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={trait}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'traits')}
                        className={`block w-full border ${errors[`trait-${index}`] ? 'border-red-500' : 'border-sei-light-gray'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm`}
                        placeholder={`Trait ${index + 1} (e.g., Friendly, Professional)`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'traits')}
                        disabled={formData.traits.length <= 1}
                        className={`px-3 py-2 rounded-md ${formData.traits.length <= 1 ? 'bg-sei-light-gray text-sei-gray cursor-not-allowed' : 'bg-sei-red text-white'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <div className="flex justify-between items-center">
                    <label htmlFor="expertise" className="block text-sm font-medium text-sei-dark-gray">
                      Areas of Expertise <span className="text-sei-red">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addArrayItem('expertise')}
                      className="text-sm text-sei-red hover:text-sei-dark-red"
                    >
                      + Add Expertise
                    </button>
                  </div>
                  <p className="text-xs text-sei-gray mb-2">Define what your agent specializes in</p>
                  
                  {formData.expertise.map((exp, index) => (
                    <div key={`expertise-${index}`} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={exp}
                        onChange={(e) => handleArrayChange(index, e.target.value, 'expertise')}
                        className={`block w-full border ${errors[`expertise-${index}`] ? 'border-red-500' : 'border-sei-light-gray'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm`}
                        placeholder={`Expertise ${index + 1} (e.g., Mathematics, Creative Writing)`}
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem(index, 'expertise')}
                        disabled={formData.expertise.length <= 1}
                        className={`px-3 py-2 rounded-md ${formData.expertise.length <= 1 ? 'bg-sei-light-gray text-sei-gray cursor-not-allowed' : 'bg-sei-red text-white'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 3: Pricing */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="rentalPricePerDay" className="block text-sm font-medium text-sei-dark-gray">
                    Rental Price per Day (SEI) <span className="text-sei-red">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="number"
                      step="0.01"
                      id="rentalPricePerDay"
                      name="rentalPricePerDay"
                      value={formData.rentalPricePerDay}
                      onChange={handleChange}
                      className={`block w-full border ${errors.rentalPricePerDay ? 'border-red-500' : 'border-sei-light-gray'} rounded-md shadow-sm py-2 pl-3 pr-12 focus:outline-none focus:ring-sei-red focus:border-sei-red sm:text-sm`}
                      placeholder="0.1"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-sei-gray sm:text-sm">SEI</span>
                    </div>
                  </div>
                  {errors.rentalPricePerDay && (
                    <p className="mt-1 text-sm text-red-500">{errors.rentalPricePerDay}</p>
                  )}
                  <p className="mt-1 text-xs text-sei-gray">Set the daily rental price for your AI agent</p>
                </div>
                
                <div className="bg-sei-offwhite rounded-md p-4">
                  <h3 className="text-sm font-medium text-sei-dark-gray mb-2">Creation Fee</h3>
                  <div className="flex justify-between text-sm">
                    <span>One-time fee:</span>
                    <span className="font-medium">0.5 SEI</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Platform fee per rental:</span>
                    <span className="font-medium">5%</span>
                  </div>
                  <div className="mt-3 text-xs text-sei-gray">
                    The creation fee is charged once when your agent is registered on the blockchain.
                    Platform fees are deducted automatically from each rental transaction.
                  </div>
                </div>
                
                {errors.wallet && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-500">{errors.wallet}</p>
                  </div>
                )}
                
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-sm text-red-500">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}
            
            {/* Form Navigation */}
            <div className="mt-8 flex justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-sei-light-gray rounded-md shadow-sm text-sm font-medium text-sei-dark-gray hover:bg-sei-light-gray focus:outline-none"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red hover:bg-sei-dark-red focus:outline-none"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isPending || isConfirming}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sei-red ${
                    (isSubmitting || isPending || isConfirming) 
                      ? 'opacity-70 cursor-not-allowed' 
                      : 'hover:bg-sei-dark-red'
                  }`}
                >
                  {isSubmitting || isPending ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isConfirming ? 'Confirming...' : 'Creating...'}
                    </>
                  ) : 'Create Agent'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 