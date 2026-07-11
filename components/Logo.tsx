import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * समाधान NEWS brand logo
 * Reusable across Navbar, Footer, About, Admin, etc.
 */
export default function Logo({
  className = "",
  showTagline = false,
  size = "md",
}: LogoProps) {
  const sizes = {
    sm: { mark: "h-8 w-8", hi: "text-xl", en: "text-[10px]", tag: "text-[10px]" },
    md: { mark: "h-10 w-10", hi: "text-2xl", en: "text-xs", tag: "text-[11px]" },
    lg: { mark: "h-14 w-14", hi: "text-4xl", en: "text-sm", tag: "text-xs" },
  }[size];

  return (
    <Link
      href="/"
      className={`group flex items-center gap-2.5 ${className}`}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      {/* Brand mark */}
      <span className="relative brand-gradient text-white flex items-center justify-center rounded-lg shadow-sm">
        <span className={`${sizes.mark} flex items-center justify-center font-en font-extrabold tracking-tighter`}>
          स
        </span>
      </span>

      <span className="flex flex-col leading-none">
        <span className="flex items-end gap-1">
          <span className={`${sizes.hi} font-extrabold text-primary font-devanagari leading-none`}>
            समाधान
          </span>
          <span className={`${sizes.en} font-en font-extrabold tracking-[0.2em] text-secondary dark:text-white leading-none mt-0.5`}>
            NEWS
          </span>
        </span>
        {showTagline && (
          <span className={`${sizes.tag} font-devanagari text-gray-500 dark:text-gray-400 leading-none mt-1`}>
            खबर वही जो सही
          </span>
        )}
      </span>
    </Link>
  );
}
