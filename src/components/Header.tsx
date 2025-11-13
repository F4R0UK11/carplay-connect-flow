import { Link } from "react-router-dom";
import { CartDrawer } from "./CartDrawer";
import { Zap } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity">
          <Zap className="h-6 w-6 text-accent" />
          <span>InCarly</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/" className="text-foreground/70 hover:text-foreground transition-colors">
            Shop
          </Link>
          <Link to="/#compatibility" className="text-foreground/70 hover:text-foreground transition-colors">
            Compatibility
          </Link>
          <Link to="/#features" className="text-foreground/70 hover:text-foreground transition-colors">
            Features
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <CartDrawer />
        </div>
      </div>
    </header>
  );
};
