import { EstimateService } from '../services/estimate.service';
import { EstimateDishDto, EstimateResponseDto } from '../dto/estimate.dto';
export declare class EstimateController {
    private readonly estimateService;
    private readonly logger;
    constructor(estimateService: EstimateService);
    estimateFromDishName(estimateDto: EstimateDishDto): Promise<EstimateResponseDto>;
    estimateFromImage(file: Express.Multer.File): Promise<EstimateResponseDto>;
}
