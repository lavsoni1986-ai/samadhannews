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
  const heights = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  }[size];

  return (
    <Link
      href="/"
      className={`flex items-center ${className}`}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      {showTagline ? (
        <>
          {/* Light mode logo with tagline */}
          <img
            src="/logo.png"
            alt="समाधान NEWS"
            className={`${heights} w-auto object-contain dark:hidden`}
          />
          {/* Dark mode logo with tagline */}
          <img
            src="/logo-dark.png"
            alt="समाधान NEWS"
            className={`${heights} w-auto object-contain hidden dark:block`}
          />
        </>
      ) : (
        /* Logo without tagline (works on both light & dark) */
        <img
          src="/logo-no-tagline.png"
          alt="समाधान NEWS"
          className={`${heights} w-auto object-contain`}
        />
      )}
    </Link>
  );
}
