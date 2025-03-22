// In the handleSubmit function:
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const mealData = await analyzeFoodDescription(description);
      setCurrentMeal(mealData);
      await addMeal(mealData); // This now saves to Firestore
      setDescription('');
    } catch (err) {
      setError('Failed to analyze food. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };