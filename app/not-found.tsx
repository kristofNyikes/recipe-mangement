"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NotFound = () => {
  const pathName = usePathname();

  const isMainRoute = pathName?.startsWith("/main");

  const homePath = isMainRoute ? "/main" : "/";
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="flex items-center gap-3">
        <span className="text-6xl font-bold text-error">404</span>
        <span className="text-4xl font-light text-base-content/50">|</span>
        <span className="text-2xl font-medium">Page not found</span>
      </div>

      <p className="mt-6 text-base-content/70 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link href={homePath} className="btn btn-primary mt-8">
        ← Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
