'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating personalized recipe ideas based on user dietary restrictions and preferences.
 *
 * - generatePersonalizedRecipes - A function that generates personalized recipe ideas.
 * - GeneratePersonalizedRecipesInput - The input type for the generatePersonalizedRecipes function.
 * - GeneratePersonalizedRecipesOutput - The output type for the generatePersonalizedRecipes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedRecipesInputSchema = z.object({
  dietaryRestrictions: z
    .string()
    .describe(
      'A comma-separated list of dietary restrictions and preferences (e.g., vegetarian, gluten-free, dairy-free, allergies: peanuts, etc.).' + 
      'Use the format 