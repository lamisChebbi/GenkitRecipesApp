# Minty Recipes: A Step-by-Step App Creation Guide

This document provides a comprehensive walkthrough of the steps taken to create the "Minty Recipes" application. We'll cover everything from the initial project setup to the integration of generative AI for recipe suggestions.

## 1. Initial Project Setup

The application is built on a modern web stack:

- **Framework**: Next.js 15 with the App Router
- **Language**: TypeScript
- **UI**: React
- **Styling**: Tailwind CSS with ShadCN UI components
- **Generative AI**: Genkit

The initial project came with a basic file structure, including configuration for Next.js, Tailwind, and TypeScript.

## 2. Building the Core User Interface

The first step was to build the visual components of the application.

### Key Components:

1.  **`src/app/layout.tsx`**: The root layout for the entire application. It sets up the base HTML structure, applies global styles, and configures the font (`PT Sans`).

2.  **`src/app/page.tsx`**: The main homepage. It contains the `Header` and the primary interactive component, `RecipeGenerator`.

3.  **`src/components/layout/header.tsx`**: A simple, sticky header component that displays the app title ("Minty Recipes") and provides navigation, such as a link to the "Favorites" page.

4.  **`src/components/recipe-generator.tsx`**: This is the heart of the user experience. It's a form with various inputs (dish type, cuisine, etc.) for users to specify their recipe preferences. It uses React's `useFormState` hook to interact with a Next.js Server Action, providing a seamless experience without a full page reload.

5.  **`src/components/recipe-card.tsx`**: A reusable component designed to display a single recipe. It includes an image, title, description, and a button to view more details. It also features a `Dialog` component (from ShadCN) to show a full-screen modal with complete recipe details.

## 3. Implementing the "Favorites" Feature

To allow users to save recipes, we implemented a client-side favorites system using `localStorage`.

1.  **`src/hooks/use-favorites.ts`**: This custom React hook encapsulates all the logic for managing favorite recipes. It provides functions to add, remove, and check for favorite recipes, syncing all changes to the browser's `localStorage`.

2.  **`src/components/favorites-button.tsx`**: A small button, placed on a `RecipeCard`, that uses the `useFavorites` hook to toggle a recipe's favorite status.

3.  **`src/app/favorites/page.tsx`**: A dedicated page that displays all the user's saved recipes.

## 4. Backend Step-by-Step: Integrating Genkit for AI

The "backend" of this application is not a traditional API server. Instead, we use **Genkit**, a framework for building AI-powered features that run securely on the server. Here’s how it was implemented:

### Step 1: Configure Genkit

In `src/ai/genkit.ts`, we initialize Genkit. This is a one-time setup that tells our app which AI model to use.

```typescript
// src/ai/genkit.ts
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
```
This configures Genkit to use the Google AI provider and sets `gemini-2.5-flash` as the default model for our AI tasks.

### Step 2: Define the AI Logic with a "Flow"

In `src/ai/flows/quick-start-with-prompt.ts`, we define the core AI logic for suggesting recipes. This file is marked with `'use server';` because it's server-side code.

#### a. Define Input/Output Schemas

We use `zod` to define the shape of the data we expect to receive from the user (the input) and the shape of the data the AI should return (the output). This provides strong type-safety and helps the AI model understand what to do.

```typescript
// Input from the form
const SuggestRecipesInputSchema = z.object({
  dishType: z.string().optional(),
  dietaryRestriction: z.string().optional(),
  cuisine: z.string().optional(),
  // ... and so on
});

// Expected output from the AI
const SuggestRecipesOutputSchema = z.object({
  recipes: z.array(z.string()),
});
```

#### b. Create the AI Prompt

Next, we define a prompt using `ai.definePrompt`. This is a template that instructs the AI on its task. We use Handlebars syntax (`{{{...}}}`) to dynamically insert the user's form data into the prompt.

```typescript
const prompt = ai.definePrompt({
  name: 'suggestRecipesPrompt',
  input: {schema: SuggestRecipesInputSchema},
  output: {schema: SuggestRecipesOutputSchema},
  prompt: `You are a recipe suggestion AI. Given the following criteria, generate a list of recipe ideas.

{{#if dishType}}Dish Type: {{{dishType}}}{{/if}}
{{#if dietaryRestriction}}Dietary Restriction: {{{dietaryRestriction}}}{{/if}}
...

Please provide a list of recipe names that match these criteria.`,
});
```

#### c. Create the Genkit Flow

Finally, we wrap our logic in a **Flow** using `ai.defineFlow`. A flow is an executable unit of work. This flow takes the user input, calls the AI with our prompt, and returns the structured output.

```typescript
const suggestRecipesFlow = ai.defineFlow(
  {
    name: 'suggestRecipesFlow',
    inputSchema: SuggestRecipesInputSchema,
    outputSchema: SuggestRecipesOutputSchema,
  },
  async input => {
    // Call the prompt with the input
    const {output} = await prompt(input);
    return output!;
  }
);
```

This completes our server-side AI implementation. The flow is now ready to be called.

## 5. How the Frontend Calls the Backend "API"

In Next.js, we don't need to create traditional REST or GraphQL API endpoints. We use **Server Actions**, which are functions that run on the server but can be called directly from our frontend components as if they were local functions.

### Step 1: Create the Server Action

In `src/app/actions.ts`, we define the `getRecipes` server action. This function acts as the bridge between our frontend form and our backend Genkit flow.

```typescript
// src/app/actions.ts
'use server';

import { suggestRecipes } from '@/ai/flows/quick-start-with-prompt';
import type { Recipe } from '@/lib/types';

// ...

export async function getRecipes(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. Extract data from the form
  const rawFormData = {
    dishType: formData.get('dishType') as string | null,
    // ... extract other fields
  };

  try {
    // 2. Call the Genkit flow (our "backend")
    const result = await suggestRecipes(rawFormData);
    
    // 3. Process the AI's response and generate mock data
    const recipes: Recipe[] = result.recipes.map((name, index) => ({
      name,
      ...generateMockDetails(name, index),
    }));

    // 4. Return the new state to the frontend
    return { message: '', recipes };
  } catch (error) {
    // ... handle errors
  }
}
```

### Step 2: Connect the Form to the Server Action

In `src/components/recipe-generator.tsx`, we use the `useFormState` hook from React to connect our form directly to the `getRecipes` server action.

```tsx
// src/components/recipe-generator.tsx
'use client';

import { useFormState } from 'react-dom';
import { getRecipes } from '@/app/actions';

// ...

export function RecipeGenerator() {
  // `formAction` is now linked to our `getRecipes` server action
  const [state, formAction] = useFormState(getRecipes, initialState);

  return (
    // ...
    // The `action` prop on the form is our server action
    <form action={formAction} className="space-y-4">
      {/* All the form inputs go here */}
      <SubmitButton />
    </form>

    {/* The component automatically re-renders with new recipes when the action completes */}
    {state.recipes && (
      // ... display recipes
    )}
    //...
  );
}
```

When the user clicks the submit button, Next.js automatically sends the form data to the `getRecipes` server action on the server. The action runs, calls the Genkit AI flow, and returns the new state. The `RecipeGenerator` component then re-renders to display the recipes. This entire process happens without a full page reload, creating a smooth user experience.
