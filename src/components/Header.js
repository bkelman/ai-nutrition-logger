import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-2 sm:mb-0 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold">AI Nutrition Logger</h1>
          <p className="text-sm sm:text-base">Track your food intake with AI</p>
        </div>
        
        {currentUser && (
          <div className="flex items-center">
            <span className="mr-2 sm:mr-4 text-sm sm:text-base">
              Hello, {currentUser.displayName || currentUser.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-white text-green-700 px-2 py-1 sm:px-3 sm:py-1 text-sm rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;