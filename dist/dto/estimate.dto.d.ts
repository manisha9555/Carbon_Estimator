export declare class EstimateDishDto {
    dish: string;
}
export declare class IngredientDto {
    name: string;
    carbon_kg: number;
}
export declare class EstimateResponseDto {
    dish: string;
    estimated_carbon_kg: number;
    ingredients: IngredientDto[];
}
