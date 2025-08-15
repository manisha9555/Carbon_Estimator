"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = __importDefault(require("openai"));
let AiService = AiService_1 = class AiService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(AiService_1.name);
        const apiKey = this.configService.get('OPENAI_API_KEY');
        if (!apiKey) {
            this.logger.warn('OpenAI API key not found in environment variables');
        }
        this.openai = new openai_1.default({
            apiKey: apiKey || 'dummy-key',
        });
    }
    async extractIngredientsFromDish(dishName) {
        try {
            const prompt = `Given the dish name "${dishName}", please list the main ingredients that would typically be used to make this dish. 
      Return only a JSON array of ingredient names as strings, nothing else. 
      Example: ["rice", "chicken", "spices", "oil"]`;
            const completion = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a culinary expert. Provide only the requested information in the exact format specified.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200,
            });
            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }
            try {
                const ingredients = JSON.parse(response);
                if (Array.isArray(ingredients)) {
                    return ingredients;
                }
            }
            catch (parseError) {
                this.logger.warn('Failed to parse OpenAI response as JSON, attempting to extract ingredients manually');
            }
            const fallbackIngredients = this.extractIngredientsFromText(response);
            return fallbackIngredients;
        }
        catch (error) {
            this.logger.error('Error extracting ingredients from OpenAI:', error);
            return this.getMockIngredients(dishName);
        }
    }
    async extractIngredientsFromImage(imageBuffer) {
        try {
            this.logger.log('Processing image for ingredient extraction');
            const mockIngredients = [
                'rice', 'chicken', 'vegetables', 'spices', 'oil'
            ];
            return mockIngredients;
        }
        catch (error) {
            this.logger.error('Error extracting ingredients from image:', error);
            return this.getMockIngredients('Unknown Dish');
        }
    }
    async estimateCarbonFootprint(ingredients) {
        try {
            const prompt = `Given these ingredients: ${ingredients.join(', ')}, please estimate the carbon footprint in kg CO2 equivalent for each ingredient.
      Consider typical serving sizes and production methods. Return only a JSON array with objects containing 'name' and 'carbon_kg' properties.
      Example: [{"name": "rice", "carbon_kg": 1.1}, {"name": "chicken", "carbon_kg": 2.5}]`;
            const completion = await this.openai.chat.completions.create({
                model: this.configService.get('OPENAI_MODEL') || 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are an environmental scientist specializing in food carbon footprints. Provide realistic estimates based on typical production methods.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.2,
                max_tokens: 300,
            });
            const response = completion.choices[0]?.message?.content;
            if (!response) {
                throw new Error('No response from OpenAI');
            }
            try {
                const carbonEstimates = JSON.parse(response);
                if (Array.isArray(carbonEstimates) && carbonEstimates.every(item => typeof item === 'object' && 'name' in item && 'carbon_kg' in item)) {
                    return carbonEstimates;
                }
            }
            catch (parseError) {
                this.logger.warn('Failed to parse carbon footprint response as JSON');
            }
            return this.generateMockCarbonEstimates(ingredients);
        }
        catch (error) {
            this.logger.error('Error estimating carbon footprint from OpenAI:', error);
            return this.generateMockCarbonEstimates(ingredients);
        }
    }
    extractIngredientsFromText(text) {
        const ingredientPatterns = [
            /["']([^"']+)["']/g,
            /\[([^\]]+)\]/g,
            /([a-zA-Z\s]+)(?=,|$)/g
        ];
        for (const pattern of ingredientPatterns) {
            const matches = text.match(pattern);
            if (matches && matches.length > 0) {
                return matches
                    .map(match => match.replace(/["'[\]]/g, '').trim())
                    .filter(item => item.length > 0 && !item.includes('Example'));
            }
        }
        return this.getMockIngredients('Unknown Dish');
    }
    getMockIngredients(dishName) {
        const commonIngredients = {
            'biryani': ['rice', 'chicken', 'spices', 'oil', 'onions', 'tomatoes'],
            'pizza': ['flour', 'cheese', 'tomato sauce', 'pepperoni', 'olive oil'],
            'salad': ['lettuce', 'tomatoes', 'cucumber', 'olive oil', 'vinegar'],
            'pasta': ['pasta', 'tomato sauce', 'cheese', 'olive oil', 'herbs'],
            'curry': ['rice', 'vegetables', 'coconut milk', 'spices', 'oil'],
            'default': ['rice', 'vegetables', 'protein', 'spices', 'oil']
        };
        const dishLower = dishName.toLowerCase();
        for (const [key, ingredients] of Object.entries(commonIngredients)) {
            if (dishLower.includes(key)) {
                return ingredients;
            }
        }
        return commonIngredients.default;
    }
    generateMockCarbonEstimates(ingredients) {
        const carbonFactors = {
            'rice': 1.1,
            'chicken': 2.5,
            'beef': 4.0,
            'pork': 2.8,
            'fish': 1.8,
            'eggs': 0.8,
            'milk': 0.6,
            'cheese': 1.8,
            'bread': 0.7,
            'pasta': 0.8,
            'tomatoes': 0.3,
            'lettuce': 0.2,
            'onions': 0.2,
            'potatoes': 0.3,
            'carrots': 0.2,
            'spinach': 0.2,
            'olive oil': 0.4,
            'vegetable oil': 0.3,
            'butter': 0.9,
            'sugar': 0.3,
            'flour': 0.4,
            'spices': 0.1,
            'herbs': 0.1,
            'coconut milk': 0.5,
            'vegetables': 0.3,
            'protein': 2.0,
            'oil': 0.4,
        };
        return ingredients.map(ingredient => {
            const ingredientLower = ingredient.toLowerCase();
            let carbonKg = 0.5;
            for (const [key, factor] of Object.entries(carbonFactors)) {
                if (ingredientLower.includes(key) || key.includes(ingredientLower)) {
                    carbonKg = factor;
                    break;
                }
            }
            return {
                name: ingredient,
                carbon_kg: Math.round(carbonKg * 100) / 100
            };
        });
    }
};
exports.AiService = AiService;
exports.AiService = AiService = AiService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map