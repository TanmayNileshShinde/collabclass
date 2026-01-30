import { Link } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";

import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full glassmorphism-dark border-b px-6 py-4 lg:px-10">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="relative">
          <img
            src="/icons/logo.png"
            alt="collabclass logo"
            className="h-10 w-10 scale-150 origin-left max-sm:scale-100 transition-transform duration-200 group-hover:scale-160"
          />
          <div className="absolute inset-0 bg-white/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <p className="text-[26px] font-extrabold text-white max-sm:hidden tracking-tight transition-all duration-200 group-hover:text-white/90">
          CollabClass
        </p>
      </Link>
      
      <div className="flex-between gap-4">
        <SignedIn>
          <div className="glassmorphism-button p-2 rounded-lg">
            <ThemeToggle />
          </div>
          <div className="glassmorphism-button p-1 rounded-lg">
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
