import Link from 'next/link';
import { Leaf, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block font-headline text-lg">
            Minty Recipes
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Link href="/favorites" passHref>
            <Button variant="ghost" size="icon" aria-label="Favorite Recipes">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
