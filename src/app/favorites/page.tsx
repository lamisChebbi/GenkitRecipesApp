'use client';

import { Header } from '@/components/layout/header';
import { RecipeCard } from '@/components/recipe-card';
import { useFavorites } from '@/hooks/use-favorites';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, isMounted } = useFavorites();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12 font-headline">
              Your Favorite Recipes
            </h1>
            
            {isMounted && favorites.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorites.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            )}
            
            {isMounted && favorites.length === 0 && (
              <div className="mt-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-secondary p-6 rounded-full">
                  <Heart className="h-16 w-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold">No Favorites Yet</h2>
                <p className="text-muted-foreground max-w-md">
                  Looks like you haven't saved any recipes. Explore and find your new favorites!
                </p>
                <Link href="/" passHref>
                  <Button>Find Recipes</Button>
                </Link>
              </div>
            )}
            
            {!isMounted && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card p-4 rounded-lg space-y-3">
                    <div className="aspect-[3/2] w-full bg-muted rounded animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                        <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
