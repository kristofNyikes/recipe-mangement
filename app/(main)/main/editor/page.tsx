import RecipeEditor from "@/app/Components/Forms/RecipeEditor";

const CreateRecipePage = () => {
  return (
    <RecipeEditor
      initialRecipe={{
        title: "",
        description: "",
        prepTime: 1,
        cookTime: 1,
        servings: 1,
        ingredients: [],
        steps: [],
      }}
    />
  );
};

export default CreateRecipePage;
