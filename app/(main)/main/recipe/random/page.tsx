import RandomRecipePicker from "@/app/Components/RecipeComponents/RandomRecipePicker";

const RandomRecipePage = () => {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Random Recipe</h1>
        <p className="mt-1 text-base-content/60">
          Let fate decide what's cooking, or narrow it down with tags.
        </p>
      </div>

      <RandomRecipePicker />
    </main>
  );
};

export default RandomRecipePage;
