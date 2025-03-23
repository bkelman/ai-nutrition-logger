import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

function AuthContainer() {
  const [showSignUp, setShowSignUp] = useState(false);
  
  return (
    // In AuthContainer.js
<div className="min-h-screen bg-gray-100 py-6 sm:py-12 px-4">
  <div className="max-w-md mx-auto mb-6 sm:mb-8 text-center">
    <h1 className="text-2xl sm:text-3xl font-bold text-black-700">Bite</h1>
    <p className="text-gray-600">Track your nutrition with the power of AI</p>
  </div>
  
  {showSignUp ? (
    <SignUp setShowSignUp={setShowSignUp} />
  ) : (
    <SignIn setShowSignUp={setShowSignUp} />
  )}
</div>
  );
}

export default AuthContainer;