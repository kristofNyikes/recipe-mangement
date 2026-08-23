import Collections from "@/app/Components/MainPageComponents/Collections";
import QuickActions from "@/app/Components/MainPageComponents/QuickActions";
import RandomRecipeCard from "@/app/Components/MainPageComponents/RandomRecipeCard";
import RecentRecipes from "@/app/Components/RecipeComponents/RecentRecipes";

const MainPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your recipes</h1>
        <p className="text-base-content/60 mt-1">
          Manage and discover your recipes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <RecentRecipes />
        </section>

        <section>
          <QuickActions />
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Collections />
        <RandomRecipeCard />
      </div>
    </div>
  );
};

export default MainPage;
