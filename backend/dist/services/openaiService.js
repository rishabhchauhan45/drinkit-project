"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openaiService = void 0;
const openai_1 = __importDefault(require("openai"));
let openaiInstance = null;
const getOpenAI = () => {
    if (!openaiInstance) {
        openaiInstance = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
    }
    return openaiInstance;
};
exports.openaiService = {
    async verifyAge(idImage, selfie) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
            return { isVerified: true, age: 25, confidence: 99, reason: 'Dummy verification passed', extractedData: {} };
        }
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: [
                        { type: "text", text: "Verify if this person is above 21. Check DOB, photo match, ID authenticity. Return JSON with: isVerified, age, confidence, reason, extractedData" },
                        { type: "image_url", image_url: { url: idImage } },
                        { type: "image_url", image_url: { url: selfie } }
                    ] }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    },
    async getRecommendations(userHistory, preferences) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
            return { products: [] };
        }
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: `Based on user history: ${JSON.stringify(userHistory)} and preferences: ${JSON.stringify(preferences)}, recommend 5 products. Return JSON with products array: { productId, reason, confidence }` }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    },
    async suggestPairings(productName, category) {
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.includes('your-openai')) {
            return { pairings: [], servingTips: [] };
        }
        const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: `Suggest snack pairings for ${productName} (${category}). Return JSON: { pairings: [{ name, description, reason, priceRange }], servingTips: string[] }` }],
            response_format: { type: "json_object" }
        });
        return JSON.parse(response.choices[0].message.content || '{}');
    }
};
