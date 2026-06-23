import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  return (
    <div className="hero h-full relative">
      <Image
        src="/images/herobanner.jpg"
        alt="Hero background"
        fill
        className="object-cover brightness-50 contrast-125"
        priority
        quality={75}
      />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80"></div>
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Recipe Management</h1>
          <p className="mb-5">
            A place to keep your recipes in a centralized way with unit
            conversion, serving scaling collections and much more. Join us
            today!
          </p>
          <Link href={"/auth/signup"} className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
