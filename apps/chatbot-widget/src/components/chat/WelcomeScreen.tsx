'use client';

import React from 'react';
import { Heart, Clock, ChefHat, Utensils, Star, HelpCircle, ShoppingCart, User as UserIcon } from 'lucide-react';

interface WelcomeScreenProps {
  onActionSelect: (action: string) => void;
  userName?: string | undefined;
}

export function WelcomeScreen({ onActionSelect, userName }: WelcomeScreenProps) {
  const actionCards = [
    {
      id: 'create-bowl',
      title: 'Create my personal bowl',
      icon: ChefHat,
      description: 'Build a custom grain bowl'
    },
    {
      id: 'favorites',
      title: 'Pull up my favourites',
      icon: Heart,
      description: 'Quick access to saved bowls'
    },
    {
      id: 'previous-order',
      title: 'Order my previous bowl',
      icon: Clock,
      description: 'Reorder your last meal'
    }
  ];

  const bottomTabs = [
    { id: 'create', label: 'Create Bowls', icon: ChefHat, active: true },
    { id: 'signature', label: 'Signature Bowls', icon: Star, active: false },
    { id: 'recent', label: 'Recent Orders', icon: Clock, active: false },
    { id: 'favourites', label: 'Favourites', icon: Heart, active: false },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, active: false }
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <div 
            className="heybo-chatbot-welcome-header"
            style={{
              background: 'var(--heybo-primary-gradient)',
              borderRadius: '16px 16px 0 0',
              padding: '20px',
              textAlign: 'center',
              color: 'white'
            }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ 
                fontFamily: 'Inter, sans-serif'
              }}
            >
              H
            </div>
            <span className="text-lg font-semibold text-gray-800">HEYBO</span>
          </div>
        </div>
        
        {userName && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">{userName}</span>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div 
          className="heybo-chatbot-welcome-avatar"
          style={{
            background: 'var(--heybo-primary-gradient)',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}
        >
          O
        </div>

        {/* Greeting */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {userName ? `Hi ${userName}!` : 'Hey There!'}
        </h1>

        {/* Description */}
        <p className="text-center text-gray-600 mb-8 max-w-md leading-relaxed">
          I'm here to help you build your perfect grain bowl! I can filter by your nutritional goals, 
          flavor profile or even align with your sustainability values; then send your order 
          straight to checkout for easy pickup. What can I get you?
        </p>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
          {actionCards.map((card) => (
            <button
              key={card.id}
              onClick={() => onActionSelect(card.id)}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-[var(--heybo-primary-300)] hover:shadow-md transition-all duration-200 text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--heybo-primary-50)] flex items-center justify-center group-hover:bg-[var(--heybo-primary-100)] transition-colors">
                <card.icon className="w-6 h-6 text-[var(--heybo-primary-600)]" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{card.title}</h3>
              <p className="text-sm text-gray-500">{card.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 bg-white">
        <div className="flex items-center justify-around py-3 px-2">
          {bottomTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onActionSelect(tab.id)}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg transition-colors ${
                tab.active 
                  ? 'text-[var(--heybo-primary-600)] bg-[var(--heybo-primary-50)]' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
