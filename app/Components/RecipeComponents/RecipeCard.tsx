import Link from "next/link";
import { RecipeCardProps } from "@/app/types";

const RecipeCard = (recipe: RecipeCardProps) => {
  return (
    <Link
      href={`/main/recipe/${recipe.slug}`}
      className="card bg-base-100 border border-base-300 transition-shadow hover:shadow-md"
    >
      <div className="card-body">
        <h3 className="card-title text-base">{recipe.title}</h3>

        <span className="text-sm text-primary">View recipe →</span>
      </div>
    </Link>
  );
};

export default RecipeCard;
