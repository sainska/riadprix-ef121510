import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  LayoutDashboard, 
  TrendingUp, 
  MapPin, 
  FileText, 
  Menu,
  X,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Globe,
  User,
  LogOut,
  Building2,
  ChevronDown,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Tableau de Bord", labelEn: "Dashboard", active: true },
  { icon: TrendingUp, label: "Analytiques", labelEn: "Analytics", active: false },
  { icon: MapPin, label: "Marchés", labelEn: "Markets", active: false },
  { icon: FileText, label: "Rapports", labelEn: "Reports", active: false },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-orange-light shadow-md shadow-primary/20">
              <span className="text-lg font-bold text-primary-foreground">R</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl font-bold text-foreground">RiadPrix</h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Revenue Intelligence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  item.active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {language === 'fr' ? item.label : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Language selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="Select language">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-popover border border-border shadow-lg">
                <DropdownMenuItem
                  onClick={() => setLanguage('en')}
                  className={`cursor-pointer ${language === 'en' ? 'bg-accent' : ''}`}
                >
                  🇬🇧 English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setLanguage('fr')}
                  className={`cursor-pointer ${language === 'fr' ? 'bg-accent' : ''}`}
                >
                  🇫🇷 Français
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-9 w-9 hidden sm:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
            </Button>
            
            {/* User menu or auth buttons */}
            {user ? (
              <>
                <Button variant="orange" size="sm" className="hidden md:flex gap-2">
                  <Sparkles className="h-4 w-4" />
                  {language === 'fr' ? 'Upgrade Pro' : 'Upgrade Pro'}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 hidden sm:flex">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover border border-border shadow-lg">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{profile?.full_name || 'User'}</span>
                        <span className="text-xs text-muted-foreground font-normal truncate">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/properties')} className="cursor-pointer">
                      <Building2 className="mr-2 h-4 w-4" />
                      {t('nav.properties')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/account')} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      {t('nav.account')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  {t('nav.login')}
                </Button>
                <Button variant="orange" onClick={() => navigate('/auth?mode=register')}>
                  {t('nav.register')}
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-slide-up">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {language === 'fr' ? item.label : item.labelEn}
              </button>
            ))}
            
            {/* Mobile auth buttons */}
            {!user && (
              <div className="pt-4 mt-2 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth');
                  }}
                >
                  {t('nav.login')}
                </Button>
                <Button
                  variant="orange"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/auth?mode=register');
                  }}
                >
                  {t('nav.register')}
                </Button>
              </div>
            )}
            
            {user && (
              <div className="pt-4 mt-2 border-t border-border space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  {t('nav.dashboard')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/properties');
                  }}
                >
                  <Building2 className="h-5 w-5" />
                  {t('nav.properties')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-destructive"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                  {t('nav.logout')}
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
