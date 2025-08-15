import { Injectable, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { EstimateDishDto, EstimateResponseDto, IngredientDto } from '../dto/estimate.dto';

@Injectable()
export class EstimateService {
  private readonly logger = new Logger(EstimateService.name);

  constructor(private readonly aiService: AiService) {}

  async estimateFromDishName(estimateDto: EstimateDishDto): Promise<EstimateResponseDto> {
    try {
      this.logger.log(`Estimating carbon footprint for dish: ${estimateDto.dish}`);

      // Extract ingredients using AI
      const ingredients = await this.aiService.extractIngredientsFromDish(estimateDto.dish);
      this.logger.log(`Extracted ingredients: ${ingredients.join(', ')}`);

      // Estimate carbon footprint for each ingredient
      const ingredientEstimates = await this.aiService.estimateCarbonFootprint(ingredients);
      
      // Calculate total carbon footprint
      const totalCarbon = ingredientEstimates.reduce((sum, ingredient) => sum + ingredient.carbon_kg, 0);

      const response: EstimateResponseDto = {
        dish: estimateDto.dish,
        estimated_carbon_kg: Math.round(totalCarbon * 100) / 100, // Round to 2 decimal places
        ingredients: ingredientEstimates,
      };

      this.logger.log(`Estimated total carbon footprint: ${response.estimated_carbon_kg} kg CO2`);
      return response;

    } catch (error) {
      this.logger.error(`Error estimating carbon footprint for dish ${estimateDto.dish}:`, error);
      throw error;
    }
  }

  async estimateFromImage(imageBuffer: Buffer): Promise<EstimateResponseDto> {
    try {
      this.logger.log('Estimating carbon footprint from image');

      // Extract ingredients from image using vision model
      const ingredients = await this.aiService.extractIngredientsFromImage(imageBuffer);
      this.logger.log(`Extracted ingredients from image: ${ingredients.join(', ')}`);

      // Estimate carbon footprint for each ingredient
      const ingredientEstimates = await this.aiService.estimateCarbonFootprint(ingredients);
      
      // Calculate total carbon footprint
      const totalCarbon = ingredientEstimates.reduce((sum, ingredient) => sum + ingredient.carbon_kg, 0);

      const response: EstimateResponseDto = {
        dish: 'Dish from Image', // Since we don't know the dish name from image
        estimated_carbon_kg: Math.round(totalCarbon * 100) / 100,
        ingredients: ingredientEstimates,
      };

      this.logger.log(`Estimated total carbon footprint from image: ${response.estimated_carbon_kg} kg CO2`);
      return response;

    } catch (error) {
      this.logger.error('Error estimating carbon footprint from image:', error);
      throw error;
    }
  }

  async getMockEstimate(dishName: string): Promise<EstimateResponseDto> {
    // Fallback mock response for testing
    const mockIngredients: IngredientDto[] = [
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
}
