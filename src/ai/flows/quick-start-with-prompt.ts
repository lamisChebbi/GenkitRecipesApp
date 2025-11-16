'use server';

/**
 * @fileOverview A recipe suggestion AI agent that takes a simple text prompt and generates recipe ideas.
 *
 * - suggestRecipes - A function that handles the recipe suggestion process.
 * - SuggestRecipesInput - The input type for the suggestRecipes function.
 * - SuggestRecipesOutput - The return type for the suggestRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRecipesInputSchema = z.object({
  dishType: z.string().optional().describe('The type of dish (e.g., breakfast, lunch, dinner, snack, dessert).'),
  dietaryRestriction: z.string().optional().describe('Dietary restrictions (e.g., vegetarian, vegan, gluten-free, dairy-free).'),
  cuisine: z.string().optional().describe('The type of cuisine (e.g., Italian, Mexican, Indian).'),
  skillLevel: z.string().optional().describe('The required skill level for cooking (e.g., beginner, intermediate, advanced).'),
  cookTime: z.string().optional().describe('The maximum cooking time in minutes.'),
  prompt: z.string().optional().describe('A free-text prompt for more specific recipe requests.'),
});
export type SuggestRecipesInput = z.infer<typeof SuggestRecipesInputSchema>;

const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(z.string()).describe('An array of recipe ideas based on the input prompt.'),
});
export type SuggestRecipesOutput = z.infer<typeof SuggestRecipesOutputSchema>;

export async function suggestRecipes(input: SuggestRecipesInput): Promise<SuggestRecipesOutput> {
  return suggestRecipesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a recipe suggestion AI. Given the following criteria, generate a list of recipe ideas.

{{#if dishType}}Dish Type: {{{dishType}}}{{/if}}
{{#if dietaryRestriction}}Dietary Restriction: {{{dietaryRestriction}}}{{/if}}
{{#if cuisine}}Cuisine: {{{cuisine}}}{{/if}}
{{#if skillLevel}}Skill Level: {{{skillLevel}}}{{/if}}
{{#if cookTime}}Maximum Cooking Time: {{{cookTime}}} minutes{{/if}}
{{#if prompt}}Specific Request: {{{prompt}}}{{/if}}

Please provide a list of recipe names that match these criteria.`,
});

const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    // Filter out 'any' and 'none' values before sending to the prompt
    const cleanedInput = (Object.fromEntries(
      Object.entries(input).filter(([, value]) => value && value !== 'any' && value !== 'none')
    ) as SuggestRecipesInput);
    
    const {output} = await prompt(cleanedInput);
    return output!;
  }
);
