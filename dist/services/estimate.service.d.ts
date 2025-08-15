import { AiService } from './ai.service';
import { EstimateDishDto, EstimateResponseDto } from '../dto/estimate.dto';
export declare class EstimateService {
    private readonly aiService;
    private readonly logger;
    constructor(aiService: AiService);
    estimateFromDishName(estimateDto: EstimateDishDto): Promise<EstimateResponseDto>;
    estimateFromImage(imageBuffer: Buffer): Promise<EstimateResponseDto>;
    getMockEstimate(dishName: string): Promise<EstimateResponseDto>;
}
