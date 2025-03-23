// src/components/DateSelector.js
import React from 'react';

function DateSelector({ selectedDate, setSelectedDate }) {
  // Format date as YYYY-MM-DD for the input
  const formattedDate = selectedDate.toISOString().split('T')[0];
  
  const handleDateChange = (e) => {
    // Fix for timezone issues
    const dateString = e.target.value;
    const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
    
    // Create date using local timezone (months are 0-indexed in JavaScript Date)
    const newDate = new Date(year, month - 1, day);
    setSelectedDate(newDate);
  };
  
  const goToToday = () => {
    setSelectedDate(new Date());
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
    if (nextDay <= new Date()) {
      setSelectedDate(nextDay);
    }
  };

  // Format date for display
  const displayDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
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
    return nextDay <= new Date();
  };
  
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
          max={new Date().toISOString().split('T')[0]}
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