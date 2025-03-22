import React from 'react';

function Header() {
  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">AI Nutrition Logger</h1>
        <p>Track your food intake with AI</p>
      </div>
    </header>
  );
}

export default Header;