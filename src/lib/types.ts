export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: string;
}
