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

4.  **`src/components/recipe-generator.tsx`**: This is the heart of the user experience. Initially, it was a simple form with a textarea for a user prompt. It uses React's `useFormState` hook to interact with a Next.js Server Action, providing a seamless experience without a full page reload.

5.  **`src/components/recipe-card.tsx`**: A reusable component designed to display a single recipe. It includes an image, title, description, and a button to view more details. It also features a `Dialog` component (from ShadCN) to show a full-screen modal with complete recipe details (ingredients, instructions, etc.).

## 3. Implementing the "Favorites" Feature

To allow users to save recipes, we implemented a client-side favorites system using `localStorage`.

1.  **`src/hooks/use-favorites.ts`**: This custom React hook encapsulates all the logic for managing favorite recipes.
    - It initializes its state from `localStorage` when the component mounts.
    - It provides functions to `addFavorite`, `removeFavorite`, and `isFavorite`.
    - It syncs any changes back to `localStorage`.
    - It uses the `useToast` hook to show notifications when a recipe is added or removed.

2.  **`src/components/favorites-button.tsx`**: A small button, typically placed on a `RecipeCard`, that uses the `useFavorites` hook to toggle a recipe's favorite status. It visually changes (a filled vs. an empty heart icon) to reflect the current state.

3.  **`src/app/favorites/page.tsx`**: A dedicated page that uses the `useFavorites` hook to retrieve and display all the user's saved recipes using the `RecipeCard` component. It also handles the empty state gracefully, prompting the user to find recipes if none are saved.

## 4. Integrating Generative AI with Genkit

This was the most critical step to make the app intelligent. We used Genkit to connect to a generative AI model and get recipe suggestions.

### What is Genkit?

Genkit is a framework that helps structure and manage calls to large language models (LLMs). It allows us to define "flows" which are like serverless functions for AI tasks.

### The Integration Steps:

1.  **Configuration (`src/ai/genkit.ts`)**: We set up a global `ai` object. This file configures Genkit to use the Google AI provider and specifies the default model to use (`gemini-2.5-flash`).

2.  **Creating the AI Flow (`src/ai/flows/quick-start-with-prompt.ts`)**: This file defines the core AI logic.
    - **Schemas (`zod`)**: We used `zod` to define the expected `input` and `output` shapes for our AI flow. This ensures type safety and helps the AI model understand what kind of data to expect and what format to return. Our initial input was a simple prompt, and later we expanded it to include structured data like `dishType`, `cuisine`, etc. The output is a list of recipe names.
    - **Prompt Template**: We created a `prompt` using `ai.definePrompt`. The prompt is a string template (using Handlebars syntax, e.g., `{{{prompt}}}`) that instructs the AI on its role ("You are a recipe suggestion AI...") and passes the user's input to the model.
    - **The Flow**: We defined the main logic using `ai.defineFlow`. This function takes the user input, calls the prompt with that input, and returns the structured output from the model.

## 5. Connecting the Frontend to the AI Backend

With the UI and the AI flow in place, the final step was to connect them.

1.  **Next.js Server Action (`src/app/actions.ts`)**: We created a server action named `getRecipes`. Server actions are functions that run securely on the server but can be called directly from client components.
    - This action receives the `FormData` from our form.
    - It calls our `suggestRecipes` Genkit flow with the form data.
    - It receives the recipe names from the AI.
    - **Mock Data Generation**: Since the AI only returns recipe names, the action generates mock data (description, ingredients, etc.) for each recipe to make the UI feel complete. It also selects a placeholder image.
    - It returns a state object containing the list of recipes or an error message.

2.  **Invoking the Action (`src/components/recipe-generator.tsx`)**:
    - We used the `useFormState` hook to tie our form to the `getRecipes` server action.
    - When the user submits the form, Next.js automatically calls the server action.
    - The component re-renders with the new state (the list of recipes), which are then passed to `RecipeCard` components for display.

## 6. Bug Fixing: Server-Side Rendering Error

We encountered a `TypeError: Cannot read properties of null (reading 'use')`. This happened because we were trying to use a standard `<link>` tag to load a Google Font in `src/app/layout.tsx`, which is not the correct approach for the Next.js App Router.

**The Fix**:
- We removed the manual `<head>` and `<link>` tags.
- We used the `next/font/google` utility to properly import and configure the `PT_Sans` font. This is the modern, optimized way to handle fonts in Next.js, and it resolved the server rendering error.

And that's it! By following these steps, we built a fully functional, AI-powered recipe generator application.