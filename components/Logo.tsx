import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
  forceDark?: boolean;
}

export default function Logo({
  className = "",
  showTagline = false,
  forceDark = false,
}: LogoProps) {
  // Combine classes into a single clean string cleanly
  const linkClassName = `flex items-center justify-center bg-transparent ${className}`.trim().replace(/\s+/g, " ");

  return (
    <Link
      href="/"
      className={linkClassName}
      aria-label="समाधान NEWS – मुख्य पृष्ठ"
    >
      {showTagline ? (
        <>
          {/* Mobile view: Dynamic crop to tagline-free logo for maximum readability */}
          <div className="md:hidden h-full w-full flex items-center justify-center bg-transparent">
            <Image
              src="/logo-no-tagline.png"
              alt="समाधान NEWS"
              width={192}
              height={64}
              priority
              unoptimized={true}
              className="h-full w-full object-contain bg-transparent drop-shadow-md brightness-110 contrast-125"
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
              className="h-full w-full object-contain bg-transparent drop-shadow-md brightness-110 contrast-110"
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
              className="h-full w-full object-contain bg-transparent drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)] brightness-125 contrast-125"
            />
          </div>
        </>
      ) : (
        /* Default: Logo without tagline */
        <div className="h-full w-full flex items-center justify-center bg-transparent">
          <Image
            src="/logo-no-tagline.png"
            alt="समाधान NEWS"
            width={240}
            height={80}
            priority
            unoptimized={true}
            className="h-full w-full object-contain bg-transparent drop-shadow-md brightness-110 contrast-125"
          />
        </div>
      )}
    </Link>
  );
}
