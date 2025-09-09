import React from 'react';
import { redirect } from 'next/navigation';

// Temporary redirect to the client app until we migrate to Next.js App Router
export default function HomePage() {
  // For now, serve the client app content
  return (
    <div className="min-h-screen bg-slerf-dark">
      <div className="container mx-auto px-4 py-8 text-center text-white">
        <h1 className="text-4xl font-bold mb-4 text-slerf-orange">SlerfHub</h1>
        <p className="text-xl mb-8">Web3 Rewards Platform</p>
        <p className="text-gray-300">Migrating to latest Next.js with enhanced SLERF token integration...</p>
      </div>
    </div>
  );
}