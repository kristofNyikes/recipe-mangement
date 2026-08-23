import Link from "next/link";

const QuickActions = () => {
  return (
    <div className="card bg-base-200 shadow-sm">
      <div className="card-body">
        <h2 className="card-title">Quick actions</h2>

        <div className="mt-2 flex flex-col gap-3">
          <Link href="/main/editor" className="btn btn-primary">
            + New recipe
          </Link>

          <Link href="/main/random-recipe" className="btn btn-soft">
            🎲 Random recipe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
