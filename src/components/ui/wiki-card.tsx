import { HatGlasses, Sparkles, User } from "lucide-react";
import { AnimatedLink } from "@/components/ui/animated-link";

interface WikiCardProps {
  title: string;
  author: string;
  date: string;
  summary: string;
  href: string;
  isAiSummary?: boolean;
  isAnonymous?: boolean;
}

export function WikiCard({
  title,
  author,
  date,
  summary,
  href,
  isAiSummary = false,
  isAnonymous = false
}: WikiCardProps) {
  return (
    <div className="group/card bg-card text-card-foreground flex flex-col gap-6 rounded-xl py-6 px-6 border border-border/30 shadow-sm transition-colors duration-300 hover:border-border/100">
      {/* SVG definition for the static icon gradient */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="ai-static-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <div className="flex items-center gap-1">
            {/* User or Anonymous */}
            {!isAnonymous ? (
              <>
                <User className="size-3.5" />
                <span>{author}</span>
              </>
            ) : (
              <>
                <HatGlasses className="size-3.5" />
                <span>Anonymous author</span>
              </>
            )}
            
          </div>
          <span className="mx-0.5">•</span>
          <span>{date}</span>
        </div>
        <h3 className="text-lg leading-none font-semibold">{title}</h3>
      </div>

      <div className="flex flex-col gap-2">
        {/* AI Summary pill — above the description */}
        {isAiSummary && (
          <div className="flex items-center gap-1.5 w-fit rounded-full border border-border/60 bg-muted/30 px-2.5 py-1">
            <Sparkles
              className="size-3.5"
              style={{ stroke: "url(#ai-static-gradient)" }}
            />
            <span className="text-[11px] font-medium tracking-wide bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-500 bg-[length:200%_100%] bg-clip-text text-transparent group-hover/card:animate-[gradient-shift_4s_ease_infinite]">
              AI Summary
            </span>
          </div>
        )}
        <p className="text-muted-foreground text-sm leading-relaxed">
          {summary}
        </p>
      </div>

      <div className="pt-2 mt-auto">
        <AnimatedLink href={href} className="text-blue-600">
          Read article
        </AnimatedLink>
      </div>
    </div>
  );
}
