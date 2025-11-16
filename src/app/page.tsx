import { Header } from '@/components/layout/header';
import { RecipeGenerator } from '@/components/recipe-generator';

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex-1">
        <RecipeGenerator />
      </main>
    </div>
  );
}
