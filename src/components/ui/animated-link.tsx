import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedLinkProps extends Omit<React.ComponentProps<typeof Link>, "href"> {
  href: string | object;
  direction?: "left" | "right";
  showUnderline?: boolean;
  children: React.ReactNode;
}

export function AnimatedLink({
  direction = "right",
  showUnderline = false,
  children,
  className,
  href,
  ...props
}: AnimatedLinkProps) {
  const isLeft = direction === "left";

  return (
    <Link
      href={href}
      className={cn(
        "group/link inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200",
        className
      )}
      {...props}
    >
      {isLeft && (
        <ChevronLeft className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/link:-translate-x-1" />
      )}
      <span className="relative pb-0.5">
        {children}
        {showUnderline && (
          <span
            className={cn(
              "absolute bottom-0 h-[1.5px] w-0 bg-current transition-all duration-300 ease-out group-hover/link:w-full",
              isLeft ? "right-0" : "left-0"
            )}
          />
        )}
      </span>
      {!isLeft && (
        <ChevronRight className="size-4 shrink-0 transition-transform duration-300 ease-out group-hover/link:translate-x-1" />
      )}
    </Link>
  );
}
