import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
}

export function Logo({ className = "", showText = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={`flex items-center space-x-3 ${className}`}>
      {/* Vertical Gradient Logo */}
      <div className="w-10 h-12 bg-gradient-to-b from-brand-gradient-start to-brand-gradient-end rounded-md flex items-center justify-center shadow-sm">
        <div className="text-white font-bold text-sm">CO</div>
      </div>

      {/* CultureOwl Text */}
      {showText && (
        <div className="text-gray-800 dark:text-gray-100 text-2xl tracking-tight">
          <span className="font-bold">Culture</span>
          <span className="font-normal">Owl</span>
        </div>
      )}
    </Link>
  );
}
