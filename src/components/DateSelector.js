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
  
  return (
    <div className="flex items-center justify-between mb-6 p-3 bg-gray-100 rounded-lg">
      <button
        onClick={goToPreviousDay}
        className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50"
      >
        &larr; Previous
      </button>
      
      <div className="flex items-center">
        <input
          type="date"
          value={formattedDate}
          onChange={handleDateChange}
          className="border rounded px-2 py-1 mx-2"
          max={new Date().toISOString().split('T')[0]} // Limit to today
        />
        <button
          onClick={goToToday}
          className="ml-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Today
        </button>
      </div>
      
      <button
        onClick={goToNextDay}
        className="px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50"
        disabled={isToday(selectedDate)}
      >
        Next &rarr;
      </button>
    </div>
  );
}

// Helper function to check if a date is today
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export default DateSelector;