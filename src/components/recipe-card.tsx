'use client';

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Recipe } from '@/lib/types';
import { FavoritesButton } from './favorites-button';
import { Utensils } from 'lucide-react';

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Dialog>
      <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="p-0 relative">
          <FavoritesButton recipe={recipe} />
          <DialogTrigger asChild>
            <div className="aspect-[3/2] w-full overflow-hidden cursor-pointer">
              <Image
                src={recipe.imageUrl}
                alt={recipe.name}
                width={600}
                height={400}
                data-ai-hint={recipe.imageHint}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </DialogTrigger>
        </CardHeader>
        <DialogTrigger asChild>
          <CardContent className="p-4 flex-grow cursor-pointer">
            <CardTitle className="font-headline text-lg leading-tight mb-1">{recipe.name}</CardTitle>
            <CardDescription className="line-clamp-3 text-sm">{recipe.description}</CardDescription>
          </CardContent>
        </DialogTrigger>
        <div className="p-4 pt-0 mt-auto">
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">View Recipe</Button>
          </DialogTrigger>
        </div>
      </Card>

      <DialogContent className="max-w-3xl">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-6">
            <DialogHeader>
              <div className="aspect-[2/1] w-full overflow-hidden rounded-lg mb-4">
                <Image
                  src={recipe.imageUrl}
                  alt={recipe.name}
                  width={800}
                  height={400}
                  data-ai-hint={recipe.imageHint}
                  className="object-cover w-full h-full"
                />
              </div>
              <DialogTitle className="text-3xl font-headline">{recipe.name}</DialogTitle>
              <DialogDescription>{recipe.description}</DialogDescription>
            </DialogHeader>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="md:col-span-1">
                <h3 className="font-bold text-lg font-headline mb-2">Ingredients</h3>
                <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                  {recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
                <h3 className="font-bold text-lg font-headline mt-6 mb-2">Nutritional Info</h3>
                <p className="text-sm text-muted-foreground">{recipe.nutritionalInfo}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="font-bold text-lg font-headline mb-2">Instructions</h3>
                <ol className="space-y-3 list-decimal list-inside">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="text-sm leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
