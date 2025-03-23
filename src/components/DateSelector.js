// src/components/DateSelector.js - Update the date handling
import React from 'react';

function DateSelector({ selectedDate, setSelectedDate }) {
  // Format date as YYYY-MM-DD for the input, ensuring local timezone
  const formattedDate = selectedDate.toLocaleDateString('en-CA'); // en-CA uses YYYY-MM-DD format
  
  const handleDateChange = (e) => {
    // Get the date string from the input
    const dateString = e.target.value;
    
    // Create a new date at midnight in the local timezone
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    const newDate = new Date(year, month - 1, day, 0, 0, 0);
    
    setSelectedDate(newDate);
  };
  
  const goToToday = () => {
    // Create today's date at midnight in the local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setSelectedDate(today);
  };
  
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };
  
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Don't allow selecting future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    
    if (nextDay <= today) {
      setSelectedDate(nextDay);
    }
  };

  // Format date for display using local timezone
  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Calculate if the next day would be in the future
  const canGoToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const today = new Date();
    return nextDay <= today;
  };
  
  // Get today's date in YYYY-MM-DD format for max attribute
  const maxDate = new Date().toLocaleDateString('en-CA');
  
  return (
    <div className="mb-6 pt-2">
      {/* Date display */}
      <div className="text-center mb-2">
        <h2 className="text-lg font-medium">{displayDate}</h2>
        {!isToday(selectedDate) && (
          <button 
            onClick={goToToday}
            className="text-sm text-blue-600 mt-1"
          >
            Return to Today
          </button>
        )}
      </div>
      
      {/* Date navigation */}
      <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
        <button
          onClick={goToPreviousDay}
          className="p-2 rounded-full hover:bg-gray-200"
          aria-label="Previous day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <input
          type="date"
          value={formattedDate}
          onChange={handleDateChange}
          className="bg-transparent border-none text-center"
          max={maxDate}
        />
        
        <button
          onClick={goToNextDay}
          className={`p-2 rounded-full ${canGoToNextDay() ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed'}`}
          disabled={isToday(selectedDate)}
          aria-label="Next day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default DateSelector;