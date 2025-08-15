import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EstimateService } from '../services/estimate.service';
import { EstimateDishDto, EstimateResponseDto } from '../dto/estimate.dto';

@Controller('estimate')
export class EstimateController {
  private readonly logger = new Logger(EstimateController.name);

  constructor(private readonly estimateService: EstimateService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async estimateFromDishName(@Body() estimateDto: EstimateDishDto): Promise<EstimateResponseDto> {
    try {
      this.logger.log(`Received estimate request for dish: ${estimateDto.dish}`);
      
      if (!estimateDto.dish || estimateDto.dish.trim().length === 0) {
        throw new BadRequestException('Dish name is required');
      }

      const result = await this.estimateService.estimateFromDishName(estimateDto);
      this.logger.log(`Successfully estimated carbon footprint for ${estimateDto.dish}`);
      
      return result;
    } catch (error) {
      this.logger.error(`Error processing estimate request for ${estimateDto.dish}:`, error);
      throw error;
    }
  }

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 200 * 1024 * 1024, // 200MB limit
      },
      fileFilter: (req, file, callback) => {
        // Validate file type
        if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
          return callback(
            new BadRequestException('Only JPEG, JPG, and PNG images are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async estimateFromImage(@UploadedFile() file: Express.Multer.File): Promise<EstimateResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('Image file is required');
      }

      this.logger.log(`Received image upload: ${file.originalname} (${file.size} bytes)`);

      // Validate file size
      if (file.size > 200 * 1024 * 1024) {
        throw new BadRequestException('File size exceeds 200MB limit');
      }

      const result = await this.estimateService.estimateFromImage(file.buffer);
      this.logger.log(`Successfully estimated carbon footprint from image: ${file.originalname}`);
      
      return result;
    } catch (error) {
      this.logger.error('Error processing image upload:', error);
      throw error;
    }
  }
}
