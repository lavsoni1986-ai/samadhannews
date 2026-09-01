import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  forceDark?: boolean;
  variant?: "default" | "footer";
}

/**
 * समाधान NEWS brand logo
 * Uses the official transparent PNG asset exactly as supplied.
 */
export default function Logo({
  className = "",
  size = "md",
  priority = true,
  forceDark = false,
  variant = "default",
}: LogoProps) {
  const sizeClasses = {
    sm: "h-9 w-auto",
    md: "h-11 sm:h-13 w-auto",
    lg: "h-14 sm:h-16 w-auto",
  }[size];

  const src =
    variant === "footer" || forceDark
      ? "/samadhan-news-footer-white.png"
      : "/logo.png";

  return (
    <Link
      href="/"
      className={`inline-flex items-center shrink-0 bg-transparent ${className}`.trim()}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      <Image
        src={src}
        alt="समाधान NEWS – खबर वही जो सही"
        width={1024}
        height={341}
        priority={priority}
        className={`${sizeClasses} object-contain`}
      />
    </Link>
  );
}
