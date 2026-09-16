import NextTopLoader from "nextjs-toploader";
import Navbar from "../Components/Navbar/BeforeAuthNavbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NextTopLoader height={5} color="#9fe88d" />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PublicLayout;
