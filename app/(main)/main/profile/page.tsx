import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { redirect, notFound } from "next/navigation";
import ProfileSettings from "@/app/Components/Profile/ProfileSettings";

const ProfilePage = async () => {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  const [user, recipeCount, collectionCount, favoriteCount] = await Promise.all(
    [
      prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      }),
      prisma.recipe.count({
        where: { userId },
      }),
      prisma.collection.count({
        where: { userId },
      }),
      prisma.recipe.count({
        where: { userId, isFavorite: true },
      }),
    ],
  );

  if (!user) {
    notFound();
  }

  const stats = [
    { label: "Recipes", count: recipeCount },
    { label: "Collections", count: collectionCount },
    { label: "Favorites", count: favoriteCount },
  ];

  return (
    <div className="mx-6 my-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-base-content/70 mt-1">
          Manage your account and view your recipe collection statistics.
        </p>
      </div>

      {/* Account overview */}
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h2 className="card-title">Account Overview</h2>

          <div>
            <p className="text-sm text-base-content/60">Email address</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Statistics</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <div className="card bg-base-200 shadow-sm" key={stat.label}>
              <div className="card-body items-center text-center">
                <p className="text-base-content/70">{stat.label}</p>
                <p className="text-4xl font-bold">{stat.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProfileSettings initialEmail={user.email} />
    </div>
  );
};

export default ProfilePage;
