import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 shadow-sm">
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
              <Link href={"/about"} className="btn my-2.5">
                About
              </Link>
            </li>
            <li>
              <Link href={"/contact"} className="btn my-2.5">
                Contact
              </Link>
            </li>
            <li>
              <Link
                href={"/auth/login"}
                className="btn btn-soft btn-primary my-2.5"
              >
                Login
              </Link>
            </li>
            <li>
              <Link href={"/auth/signup"} className="btn btn-primary my-2.5">
                Sign up
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
            <Link href={"/about"} className="btn btn-ghost">
              About
            </Link>
          </li>
          <li>
            <Link href={"/contact"} className="btn btn-ghost">
              Contact
            </Link>
          </li>
        </ul>
      </div>

      <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-1">
          <li>
            <Link href={"/auth/login"} className="btn btn-soft btn-primary">
              Log in
            </Link>
          </li>
          <li>
            <Link href={"/auth/signup"} className="btn btn-primary">
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
