import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { stackServerApp } from "@/stack/server";
import { PlusCircle } from "lucide-react";
import { LogoutToastWatcher } from "./logout-toast-watcher";

export async function NavBar() {
  const user = await stackServerApp.getUser();

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <LogoutToastWatcher userExists={!!user} />
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-gray-900"
          >
            Wikimasters
          </Link>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="flex items-center gap-2">
            {user ? (
              <>
                <NavigationMenuItem>
                  <Button
                    render={<Link href="/wiki/edit/new" />}
                    nativeButton={false}
                  >
                    <PlusCircle />
                    <span>New Article</span>
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <UserButton />
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <Button
                    variant="outline"
                    render={<Link href="/handler/sign-in" />}
                    nativeButton={false}
                  >
                    Sign In
                  </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Button
                    render={<Link href="/handler/sign-up" />}
                    nativeButton={false}
                  >
                    Sign Up
                  </Button>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
