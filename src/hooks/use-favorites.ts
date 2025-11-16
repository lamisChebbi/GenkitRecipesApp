'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Recipe } from '@/lib/types';
import { useToast } from './use-toast';

const FAVORITES_KEY = 'minty-recipes-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage', error);
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: Recipe[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error saving favorites',
        description: 'Could not save your favorite recipes.',
      });
    }
  }, [toast]);

  const addFavorite = useCallback((recipe: Recipe) => {
    const newFavorites = [...favorites, recipe];
    saveFavorites(newFavorites);
    toast({ title: 'Added to favorites!', description: recipe.name });
  }, [favorites, saveFavorites, toast]);

  const removeFavorite = useCallback((recipeId: string) => {
    const recipeName = favorites.find(r => r.id === recipeId)?.name;
    const newFavorites = favorites.filter((fav) => fav.id !== recipeId);
    saveFavorites(newFavorites);
    toast({ title: 'Removed from favorites', description: recipeName });
  }, [favorites, saveFavorites, toast]);

  const isFavorite = useCallback((recipeId: string) => {
    return favorites.some((fav) => fav.id === recipeId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, isMounted };
}
