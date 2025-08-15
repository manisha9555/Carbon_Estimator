import { IsString, IsNotEmpty } from 'class-validator';

export class EstimateDishDto {
  @IsString()
  @IsNotEmpty()
  dish: string;
}

export class IngredientDto {
  name: string;
  carbon_kg: number;
}

export class EstimateResponseDto {
  dish: string;
  estimated_carbon_kg: number;
  ingredients: IngredientDto[];
}
