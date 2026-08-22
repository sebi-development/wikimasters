import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Button, buttonVariants } from "./ui/button";

function NavBar() {
  return (
    <nav className="w-full border-b bg-white/80 backdrop-blue supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50  ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold text-xl tracking-tight text-gray-900"
        >
          Wikimasters
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/signin" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Sign In
          </Link>
          <Link href="/signup" className={buttonVariants({ variant: "default", size: "lg" })}>
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
