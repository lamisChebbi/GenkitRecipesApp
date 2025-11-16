'use client';

import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import type { Recipe } from '@/lib/types';
import { useFavorites } from '@/hooks/use-favorites';

export function FavoritesButton({ recipe }: { recipe: Recipe }) {
  const { addFavorite, removeFavorite, isFavorite, isMounted } = useFavorites();
  
  if (!isMounted) {
    return (
       <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 rounded-full bg-background/70 hover:bg-background"
        disabled
      >
        <Heart className="h-5 w-5 text-muted-foreground" />
      </Button>
    )
  }

  const isFav = isFavorite(recipe.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFav) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-4 right-4 rounded-full bg-background/70 hover:bg-background z-10"
      onClick={toggleFavorite}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart className={`h-5 w-5 transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
    </Button>
  );
}
