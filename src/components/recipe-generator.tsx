'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getRecipes, type FormState } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RecipeCard } from '@/components/recipe-card';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const initialState: FormState = {
  message: '',
  recipes: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto px-8 transition-all duration-300">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Get Recipes'
      )}
    </Button>
  );
}

export function RecipeGenerator() {
  const [state, formAction] = useFormState(getRecipes, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.isError && state.message) {
      toast({
        variant: 'destructive',
        title: 'Oops! Something went wrong.',
        description: state.message,
      });
    }
  }, [state, toast]);
  
  const hasRecipes = state.recipes && state.recipes.length > 0;
  const showInitialState = state.recipes === undefined;
  const showNoResults = state.recipes && state.recipes.length === 0;

  return (
    <>
      <section className="w-full py-12 md:py-20 lg:py-28 bg-white dark:bg-card">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
              Your Personal Recipe Assistant
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Tell us your dietary needs, and we'll whip up some delicious recipe ideas for you.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dishType">Dish Type</Label>
                  <Select name="dishType" defaultValue="any">
                    <SelectTrigger id="dishType">
                      <SelectValue placeholder="Select dish type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                      <SelectItem value="dessert">Dessert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dietaryRestriction">Dietary Restriction</Label>
                  <Select name="dietaryRestriction" defaultValue="none">
                    <SelectTrigger id="dietaryRestriction">
                      <SelectValue placeholder="Select restriction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                      <SelectItem value="dairy-free">Dairy-Free</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="cuisine">Cuisine</Label>
                    <Input id="cuisine" name="cuisine" placeholder="e.g., Italian, Mexican" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Skill Level</Label>
                    <Select name="skillLevel" defaultValue="any">
                      <SelectTrigger id="skillLevel">
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

               <div className="space-y-2">
                  <Label htmlFor="cookTime">Max Cooking Time (in minutes)</Label>
                  <Input id="cookTime" name="cookTime" type="text" placeholder="e.g., 30" />
                </div>
              
              <div className="space-y-2">
                <Label htmlFor="prompt">Specific Prompt (optional)</Label>
                <Textarea
                  id="prompt"
                  name="prompt"
                  placeholder="e.g., something with chicken and pasta, for a special occasion..."
                  className="min-h-[100px] resize-none text-base"
                />
              </div>

              <div className="flex justify-center pt-4">
                 <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </section>

      {hasRecipes && (
        <section className="w-full pb-12 md:pb-24 lg:pb-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {state.recipes!.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      {showNoResults && (
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container flex justify-center text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Recipes Found</h2>
                <p className="text-muted-foreground">{state.message}</p>
              </div>
          </div>
        </section>
      )}

      {showInitialState && (
        <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container text-center">
                <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">Ready to get cooking?</h2>
                <p className="text-muted-foreground">Enter your preferences above to discover new recipes.</p>
            </div>
        </section>
      )}
    </>
  );
}
