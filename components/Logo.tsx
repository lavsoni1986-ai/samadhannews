import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  forceDark?: boolean;
}

/**
 * समाधान NEWS brand logo
 * Reusable across Navbar, Footer, About, Admin, etc.
 * Utilizes Next.js <Image> component with h-full and w-auto to allow fluid scaling.
 */
export default function Logo({
  className = "",
  showTagline = false,
  size = "md",
  forceDark = false,
}: LogoProps) {
  // Master dimensions representing maximum bounds for aspect-ratio calculations
  const dimensions = {
    sm: { width: 120, height: 32 },
    md: { width: 180, height: 48 },
    lg: { width: 300, height: 80 },
  }[size];

  return (
    <Link
      href="/"
      className={`flex items-center justify-center ${className}`}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      {showTagline ? (
        <>
          {/* Light mode logo with tagline */}
          <div className={forceDark ? "hidden h-full w-auto" : "dark:hidden h-full w-auto"}>
            <Image
              src="/logo.png"
              alt="समाधान NEWS"
              width={dimensions.width}
              height={dimensions.height}
              priority
              className="object-contain w-auto h-full"
            />
          </div>
          {/* Dark mode logo with tagline */}
          <div className={forceDark ? "block h-full w-auto" : "hidden dark:block h-full w-auto"}>
            <Image
              src="/logo-dark.png"
              alt="समाधान NEWS"
              width={dimensions.width}
              height={dimensions.height}
              priority
              className="object-contain w-auto h-full"
            />
          </div>
        </>
      ) : (
        /* Logo without tagline (3D metallic copper/gold works on both light & dark) */
        <Image
          src="/logo-no-tagline.png"
          alt="समाधान NEWS"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain w-auto h-full"
        />
      )}
    </Link>
  );
}
