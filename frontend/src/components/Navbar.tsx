import { Shield, LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">MedIntel</h1>
            <p className="text-[10px] text-muted-foreground leading-none">Intelligent Medicine Optimization</p>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <a href="#search" className="hover:text-primary transition-colors">{t("nav.search")}</a>
          <a href="#how-it-works" className="hover:text-primary transition-colors">{t("nav.howItWorks")}</a>
          <a href="#dashboard" className="hover:text-primary transition-colors">{t("nav.dashboard")}</a>
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-accent font-semibold">
            🇮🇳 India
          </span>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-[120px]">
                <User className="w-3 h-3 inline mr-1" />
                {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={signOut} className="text-xs">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="text-xs gap-1">
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
