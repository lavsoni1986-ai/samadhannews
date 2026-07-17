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
 * Utilizes Next.js <Image> component with unoptimized=true and absolute w-full h-full scaling.
 */
export default function Logo({
  className = "",
  showTagline = false,
  forceDark = false,
}: LogoProps) {
  return (
    <Link
      href="/"
      className={`flex items-center justify-center bg-transparent ${className}`}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      {showTagline ? (
        <>
          {/* Mobile view: Dynamic fallback to logo-no-tagline for maximum readability on small viewports */}
          <div className="md:hidden h-full w-full flex items-center justify-center bg-transparent">
            <Image
              src="/logo-no-tagline.png"
              alt="समाधान NEWS"
              width={192}
              height={64}
              priority
              unoptimized={true}
              className="h-full w-full object-contain bg-transparent"
            />
          </div>

          {/* Desktop view: Light mode logo with tagline */}
          <div className={forceDark ? "hidden" : "hidden md:block dark:md:hidden h-full w-full bg-transparent"}>
            <Image
              src="/logo.png"
              alt="समाधान NEWS"
              width={240}
              height={80}
              priority
              unoptimized={true}
              className="h-full w-full object-contain bg-transparent"
            />
          </div>

          {/* Desktop view: Dark mode logo with tagline */}
          <div className={forceDark ? "hidden md:block h-full w-full bg-transparent" : "hidden dark:md:block h-full w-full bg-transparent"}>
            <Image
              src="/logo-dark.png"
              alt="समाधान NEWS"
              width={240}
              height={80}
              priority
              unoptimized={true}
              className="h-full w-full object-contain bg-transparent"
            />
          </div>
        </>
      ) : (
        /* Logo without tagline (3D metallic copper/gold works on both light & dark) */
        <Image
          src="/logo-no-tagline.png"
          alt="समाधान NEWS"
          width={240}
          height={80}
          priority
          unoptimized={true}
          className="h-full w-full object-contain bg-transparent"
        />
      )}
    </Link>
  );
}
