const RandomRecipeCard = () => {
  return (
    <div className="card bg-base-200 shadow-sm lg:col-span-2">
      <div className="card-body">
        <h2 className="card-title">Feeling hungry?</h2>

        <p className="text-base-content/60">
          Let Recipe Management pick something for you.
        </p>

        <div className="card-actions justify-end">
          <button className="btn btn-primary" disabled>
            🎲 Surprise me
          </button>
        </div>

        <p className="text-xs text-base-content/40">
          Random recipes are coming soon.
        </p>
      </div>
    </div>
  );
};

export default RandomRecipeCard;
