import { ConfigService } from '@nestjs/config';
import { IngredientDto } from '../dto/estimate.dto';
export declare class AiService {
    private configService;
    private readonly logger;
    private openai;
    constructor(configService: ConfigService);
    extractIngredientsFromDish(dishName: string): Promise<string[]>;
    extractIngredientsFromImage(imageBuffer: Buffer): Promise<string[]>;
    estimateCarbonFootprint(ingredients: string[]): Promise<IngredientDto[]>;
    private extractIngredientsFromText;
    private getMockIngredients;
    private generateMockCarbonEstimates;
}
