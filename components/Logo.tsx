import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  forceDark?: boolean;
}

/**
 * समाधान NEWS brand logo
 * Uses the official transparent PNG asset exactly as supplied.
 */
export default function Logo({
  className = "",
  size = "md",
  priority = true,
}: LogoProps) {
  const sizeClasses = {
    sm: "h-9 w-auto",
    md: "h-11 sm:h-13 w-auto",
    lg: "h-14 sm:h-16 w-auto",
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center shrink-0 bg-transparent ${className}`.trim()}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      <Image
        src="/logo.png"
        alt="समाधान NEWS – खबर वही जो सही"
        width={1024}
        height={341}
        priority={priority}
        className={`${sizeClasses} object-contain`}
      />
    </Link>
  );
}
