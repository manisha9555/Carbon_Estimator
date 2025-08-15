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
var EstimateService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
let EstimateService = EstimateService_1 = class EstimateService {
    constructor(aiService) {
        this.aiService = aiService;
        this.logger = new common_1.Logger(EstimateService_1.name);
    }
    async estimateFromDishName(estimateDto) {
        try {
            this.logger.log(`Estimating carbon footprint for dish: ${estimateDto.dish}`);
            const ingredients = await this.aiService.extractIngredientsFromDish(estimateDto.dish);
            this.logger.log(`Extracted ingredients: ${ingredients.join(', ')}`);
            const ingredientEstimates = await this.aiService.estimateCarbonFootprint(ingredients);
            const totalCarbon = ingredientEstimates.reduce((sum, ingredient) => sum + ingredient.carbon_kg, 0);
            const response = {
                dish: estimateDto.dish,
                estimated_carbon_kg: Math.round(totalCarbon * 100) / 100,
                ingredients: ingredientEstimates,
            };
            this.logger.log(`Estimated total carbon footprint: ${response.estimated_carbon_kg} kg CO2`);
            return response;
        }
        catch (error) {
            this.logger.error(`Error estimating carbon footprint for dish ${estimateDto.dish}:`, error);
            throw error;
        }
    }
    async estimateFromImage(imageBuffer) {
        try {
            this.logger.log('Estimating carbon footprint from image');
            const ingredients = await this.aiService.extractIngredientsFromImage(imageBuffer);
            this.logger.log(`Extracted ingredients from image: ${ingredients.join(', ')}`);
            const ingredientEstimates = await this.aiService.estimateCarbonFootprint(ingredients);
            const totalCarbon = ingredientEstimates.reduce((sum, ingredient) => sum + ingredient.carbon_kg, 0);
            const response = {
                dish: 'Dish from Image',
                estimated_carbon_kg: Math.round(totalCarbon * 100) / 100,
                ingredients: ingredientEstimates,
            };
            this.logger.log(`Estimated total carbon footprint from image: ${response.estimated_carbon_kg} kg CO2`);
            return response;
        }
        catch (error) {
            this.logger.error('Error estimating carbon footprint from image:', error);
            throw error;
        }
    }
    async getMockEstimate(dishName) {
        const mockIngredients = [
            { name: 'Rice', carbon_kg: 1.1 },
            { name: 'Chicken', carbon_kg: 2.5 },
            { name: 'Spices', carbon_kg: 0.2 },
            { name: 'Oil', carbon_kg: 0.4 },
        ];
        const totalCarbon = mockIngredients.reduce((sum, ingredient) => sum + ingredient.carbon_kg, 0);
        return {
            dish: dishName,
            estimated_carbon_kg: totalCarbon,
            ingredients: mockIngredients,
        };
    }
};
exports.EstimateService = EstimateService;
exports.EstimateService = EstimateService = EstimateService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], EstimateService);
//# sourceMappingURL=estimate.service.js.map