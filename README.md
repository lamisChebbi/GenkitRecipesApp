# 🌿 Minty Recipes

Welcome to Minty Recipes, your personal AI-powered recipe assistant! This application helps you discover new and exciting recipe ideas tailored to your specific tastes and dietary needs.

This project was built with Firebase Studio to showcase how to build modern, AI-powered web applications using Next.js and Google's Genkit.

![Minty Recipes Screenshot](https://storage.googleapis.com/static.aifirebase.dev/codestudio/minty-recipes-screenshot.png)

## ✨ Features

- **Dynamic Recipe Generation**: Use a detailed form to specify dish type, cuisine, dietary restrictions, skill level, and cook time.
- **AI-Powered Suggestions**: Leverages Genkit and Google's Gemini model to provide relevant and creative recipe ideas.
- **Save Your Favorites**: Like a recipe? Save it to your browser's local storage with a single click.
- **View Full Recipes**: Click on any recipe card to see a detailed view with ingredients and step-by-step instructions.
- **Responsive Design**: A clean, modern, and fully responsive UI built with Tailwind CSS and ShadCN UI.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) 15 (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [React](https://react.dev/) with [ShadCN UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Generative AI**: [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini model)
- **State Management**: React Hooks (`useFormState`, `useState`)

## ⚙️ Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- Node.js (v18 or later)
- npm or another package manager

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project. You will need a Google AI API key to use the generative AI features. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```.env
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

## 📁 Project Structure

Here is a brief overview of the key directories and files:

- **/src/app/**: Contains the pages and layouts for the Next.js App Router.
  - `page.tsx`: The main homepage.
  - `favorites/page.tsx`: The page that displays saved favorite recipes.
  - `actions.ts`: Holds the Next.js Server Action (`getRecipes`) that connects the frontend to the backend logic.
- **/src/ai/**: The heart of the AI implementation.
  - `genkit.ts`: Initializes and configures Genkit with the Google AI plugin and a default model.
  - `flows/quick-start-with-prompt.ts`: Defines the Genkit "flow" for generating recipes, including input/output schemas and the AI prompt.
- **/src/components/**: Contains all the reusable React components.
  - `recipe-generator.tsx`: The main form component for user input.
  - `recipe-card.tsx`: The card component used to display each recipe.
  - `layout/header.tsx`: The application's main header.
- **/src/hooks/**: Custom React hooks for shared client-side logic.
  - `use-favorites.ts`: Manages adding, removing, and storing favorite recipes in `localStorage`.
- **/APP_CREATION_GUIDE.md**: A detailed, step-by-step guide on how this application was built.

## 🤖 How the AI Works

The backend logic is powered by **Genkit**, a framework for building, deploying, and monitoring AI-powered features.

1.  **User Input**: The user fills out the form in the `RecipeGenerator` component.
2.  **Server Action**: Submitting the form calls the `getRecipes` Server Action in `src/app/actions.ts`.
3.  **Genkit Flow**: The server action invokes the `suggestRecipes` flow defined in `src/ai/flows/quick-start-with-prompt.ts`.
4.  **AI Prompt**: The flow passes the user's preferences into a structured prompt, which is sent to the Gemini model.
5.  **AI Response**: The model returns a list of recipe names.
6.  **Data Hydration**: The server action receives the names, generates mock data (ingredients, instructions) for each one, and returns the complete recipe objects to the frontend.
7.  **UI Update**: The `RecipeGenerator` component re-renders to display the new recipes.
