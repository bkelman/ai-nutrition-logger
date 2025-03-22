import axios from 'axios';

export const analyzeFoodDescription = async (description) => {
  try {
    // This would be a backend API call in production
    // For the prototype, we'll call OpenAI directly from the frontend (not recommended for production)
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a nutrition analysis assistant. Extract the food items from the user's description and estimate their nutritional information. 
            Return a JSON object with the following structure:
            {
              "description": "The original food description",
              "timestamp": "ISO timestamp",
              "items": [
                {
                  "name": "Food item name",
                  "portion": "Estimated portion",
                  "calories": 0,
                  "protein": 0,
                  "carbs": 0,
                  "fat": 0
                }
              ],
              "totals": {
                "calories": 0,
                "protein": 0,
                "carbs": 0,
                "fat": 0
              }
            }
            Be as accurate as possible with nutritional estimates. Include all identified foods. Don't include any explanations, just the JSON object.`
          },
          {
            role: 'user',
            content: description
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Parse the response to extract the JSON object
    const content = response.data.choices[0].message.content;
    const nutritionData = JSON.parse(content);
    
    return {
      ...nutritionData,
      timestamp: new Date().toISOString() // Ensure we have a timestamp
    };
  } catch (error) {
    console.error('Error analyzing food description:', error);
    throw error;
  }
};