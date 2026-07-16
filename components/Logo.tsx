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
 * Utilizes Next.js <Image> component to prevent layout shifts.
 */
export default function Logo({
  className = "",
  showTagline = false,
  size = "md",
  forceDark = false,
}: LogoProps) {
  // Explicit pixel boundaries to prevent layout shifts (LCP/CLS optimizations)
  const dimensions = {
    sm: { width: 120, height: 32 },
    md: { width: 150, height: 40 },
    lg: { width: 210, height: 56 },
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
          <div className={forceDark ? "hidden" : "dark:hidden"}>
            <Image
              src="/logo.png"
              alt="समाधान NEWS"
              width={dimensions.width}
              height={dimensions.height}
              priority
              className="object-contain w-auto h-auto"
              style={{ maxHeight: dimensions.height }}
            />
          </div>
          {/* Dark mode logo with tagline */}
          <div className={forceDark ? "block" : "hidden dark:block"}>
            <Image
              src="/logo-dark.png"
              alt="समाधान NEWS"
              width={dimensions.width}
              height={dimensions.height}
              priority
              className="object-contain w-auto h-auto"
              style={{ maxHeight: dimensions.height }}
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
          className="object-contain w-auto h-auto"
          style={{ maxHeight: dimensions.height }}
        />
      )}
    </Link>
  );
}
