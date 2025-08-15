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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var EstimateController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstimateController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const estimate_service_1 = require("../services/estimate.service");
const estimate_dto_1 = require("../dto/estimate.dto");
let EstimateController = EstimateController_1 = class EstimateController {
    constructor(estimateService) {
        this.estimateService = estimateService;
        this.logger = new common_1.Logger(EstimateController_1.name);
    }
    async estimateFromDishName(estimateDto) {
        try {
            this.logger.log(`Received estimate request for dish: ${estimateDto.dish}`);
            if (!estimateDto.dish || estimateDto.dish.trim().length === 0) {
                throw new common_1.BadRequestException('Dish name is required');
            }
            const result = await this.estimateService.estimateFromDishName(estimateDto);
            this.logger.log(`Successfully estimated carbon footprint for ${estimateDto.dish}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error processing estimate request for ${estimateDto.dish}:`, error);
            throw error;
        }
    }
    async estimateFromImage(file) {
        try {
            if (!file) {
                throw new common_1.BadRequestException('Image file is required');
            }
            this.logger.log(`Received image upload: ${file.originalname} (${file.size} bytes)`);
            if (file.size > 200 * 1024 * 1024) {
                throw new common_1.BadRequestException('File size exceeds 200MB limit');
            }
            const result = await this.estimateService.estimateFromImage(file.buffer);
            this.logger.log(`Successfully estimated carbon footprint from image: ${file.originalname}`);
            return result;
        }
        catch (error) {
            this.logger.error('Error processing image upload:', error);
            throw error;
        }
    }
};
exports.EstimateController = EstimateController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [estimate_dto_1.EstimateDishDto]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "estimateFromDishName", null);
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: {
            fileSize: 200 * 1024 * 1024,
        },
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/^image\/(jpeg|jpg|png)$/)) {
                return callback(new common_1.BadRequestException('Only JPEG, JPG, and PNG images are allowed'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EstimateController.prototype, "estimateFromImage", null);
exports.EstimateController = EstimateController = EstimateController_1 = __decorate([
    (0, common_1.Controller)('estimate'),
    __metadata("design:paramtypes", [estimate_service_1.EstimateService])
], EstimateController);
//# sourceMappingURL=estimate.controller.js.map