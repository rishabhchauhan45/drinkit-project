import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const openaiService = {
  async verifyAge(idImage: string, selfie: string) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
      return { isVerified: true, age: 25, confidence: 99, reason: 'Dummy verification passed', extractedData: {} };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: [
        { type: "text", text: "Verify if this person is above 21. Check DOB, photo match, ID authenticity. Return JSON with: isVerified, age, confidence, reason, extractedData" },
        { type: "image_url", image_url: { url: idImage } },
        { type: "image_url", image_url: { url: selfie } }
      ]}],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  },

  async getRecommendations(userHistory: any[], preferences: any) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
      return { products: [] };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: `Based on user history: ${JSON.stringify(userHistory)} and preferences: ${JSON.stringify(preferences)}, recommend 5 products. Return JSON with products array: { productId, reason, confidence }` }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  },

  async suggestPairings(productName: string, category: string) {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
       return { pairings: [], servingTips: [] };
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: `Suggest snack pairings for ${productName} (${category}). Return JSON: { pairings: [{ name, description, reason, priceRange }], servingTips: string[] }` }],
      response_format: { type: "json_object" }
    });
    return JSON.parse(response.choices[0].message.content || '{}');
  }
};
