'use server';

import { suggestRecipes, type SuggestRecipesInput } from '@/ai/flows/quick-start-with-prompt';
import type { Recipe } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export interface FormState {
  message: string;
  recipes?: Recipe[];
  isError?: boolean;
}

const generateMockDetails = (recipeName: string, index: number): Omit<Recipe, 'name'> => {
  const imagePlaceholder = PlaceHolderImages[index % PlaceHolderImages.length] || { 
    imageUrl: `https://picsum.photos/seed/${recipeName}/600/400`, 
    imageHint: 'food plate' 
  };

  return {
    id: `${recipeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`,
    description: `A delicious and easy-to-make ${recipeName.toLowerCase()}. This dish is perfect for a quick weeknight meal and is sure to please the whole family.`,
    ingredients: [
      '1 cup Ingredient A (e.g., flour, chopped vegetables)',
      '2 tbsp Ingredient B (e.g., oil, sugar)',
      '1/2 tsp Spice C (e.g., paprika, cinnamon)',
      '1/4 cup Liquid D (e.g., water, milk)',
      '1 pinch of Salt',
      '1 pinch of Pepper',
    ],
    instructions: [
      'Preheat your oven to 375°F (190°C).',
      'In a large bowl, combine all dry ingredients.',
      'In a separate bowl, whisk together all wet ingredients.',
      'Pour the wet ingredients into the dry ingredients and mix until just combined.',
      'Pour the batter into a prepared baking dish.',
      'Bake for 25-30 minutes, or until a toothpick inserted into the center comes out clean.',
      'Let it cool on a wire rack before serving. Enjoy!',
    ],
    nutritionalInfo: 'Approx. Calories: 350, Protein: 15g, Carbs: 45g, Fat: 12g',
    imageUrl: imagePlaceholder.imageUrl,
    imageHint: imagePlaceholder.imageHint,
  };
};

export async function getRecipes(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawFormData = {
    dishType: formData.get('dishType') as string | null,
    dietaryRestriction: formData.get('dietaryRestriction') as string | null,
    cuisine: formData.get('cuisine') as string | null,
    skillLevel: formData.get('skillLevel') as string | null,
    cookTime: formData.get('cookTime') as string | null,
    prompt: formData.get('prompt') as string | null,
  };

  const input: SuggestRecipesInput = {
    ...rawFormData,
  }

  const promptValues = Object.values(rawFormData).filter(value => value && value.trim() !== '' && value !== 'any' && value !== 'none');
  if (promptValues.length === 0) {
    return { message: 'Please provide some recipe preferences.', isError: true, recipes: prevState.recipes };
  }

  try {
    const result = await suggestRecipes(input);
    
    if (!result.recipes || result.recipes.length === 0) {
      return { message: 'No recipes found for your preferences. Try being more specific!', recipes: [] };
    }

    const recipes: Recipe[] = result.recipes.map((name, index) => ({
      name,
      ...generateMockDetails(name, index),
    }));

    return { message: '', recipes };
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred while generating recipes. Please try again.', isError: true, recipes: [] };
  }
}
