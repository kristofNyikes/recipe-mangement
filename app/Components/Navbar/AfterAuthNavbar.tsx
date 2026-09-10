import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
      {/* Left side - Logo + Mobile menu */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={-1}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-3.5 shadow"
          >
            <li>
              <Link href={"/main/editor"} className="btn my-2.5">
                New recipe
              </Link>
            </li>
            <li>
              <Link href={"/main/recipe"} className="btn my-2.5">
                All Recipes
              </Link>
            </li>
            <li>
              <Link href={"/main/random-recipe"} className="btn my-2.5">
                Random recipe
              </Link>
            </li>
            <li>
              <Link href={"/main/collections"} className="btn my-2.5">
                Collections
              </Link>
            </li>
            <li>
              <Link href={"/main/favorites"} className="btn my-2.5">
                Favorites
              </Link>
            </li>
            <li>
              <Link href={"/main/profile"} className="btn btn-primary my-2.5">
                Profile
              </Link>
            </li>
            <li>
              <Link href={"/"} className="btn btn-soft btn-primary my-2.5">
                Log out
              </Link>
            </li>
          </ul>
        </div>
        <Link
          href={"/main"}
          className="btn btn-ghost text-xl whitespace-nowrap"
        >
          Recipe Management
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href={"/main/editor"} className="btn btn-ghost">
              New recipe
            </Link>
          </li>
          <li>
            <Link href={"/main/recipe"} className="btn btn-ghost">
              All Recipes
            </Link>
          </li>
          <li>
            <Link href={"/main/random-recipe"} className="btn btn-ghost">
              Random recipe
            </Link>
          </li>
          <li>
            <Link href={"/main/collections"} className="btn btn-ghost">
              Collections
            </Link>
          </li>
          <li>
            <Link href={"/main/favorites"} className="btn btn-ghost">
              Favorites
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href={"/main/profile"} className="btn btn-primary">
              Profile
            </Link>
          </li>
          <li>
            <Link href={"/"} className="btn btn-soft btn-primary">
              Log out
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
