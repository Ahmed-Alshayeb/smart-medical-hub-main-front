import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, User, Bell, Moon, Sun, Stethoscope, Calendar, Settings, LogOut, Shield } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const navItems = [
    { name: "Book Appointment", href: "/book-appointment", icon: <Calendar className="h-4 w-4 ml-2" /> },
    { name: "Services", href: "/#services" },
    { name: "Doctors", href: "/doctors" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Clinics", href: "/clinics" },
    { name: "Pharmacy", href: "/pharmacy" },
    { name: "Labs", href: "/labs" },
    { name: "AI", href: "/ai-analysis" },
    ...(isAuthenticated ? [{ name: "Dashboard", href: "/dashboard", icon: <Settings className="h-4 w-4 ml-2" /> }] : []),
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 animate-slide-in-right hover-shine transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-row items-center h-16 w-full">
          {/* Logo and Name (Right for RTL) */}
          <div className="flex flex-row items-center gap-2 animate-fade-in hover-scale order-1">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-heartbeat shadow-lg">
              <Stethoscope className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div className="flex flex-col items-start text-left">
              <span className="text-base font-extrabold text-blue-700 dark:text-white animate-zoom-in">
                Medical Care
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 animate-fade-in mt-0.5">رعاية طبية شاملة</span>
            </div>
          </div>

          {/* Desktop Navigation (Center) */}
          <div className="hidden md:flex items-center gap-5 mx-auto order-2">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-gray-900 dark:text-white font-semibold hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 text-sm hover-scale story-link animate-fade-in-up stagger-${index + 1} flex items-center`}
              >
                {item.icon}
                {item.name}
              </a>
            ))}
          </div>

          {/* Desktop Actions (Left for RTL) */}
          <div className="hidden md:flex items-center gap-2 animate-fade-in order-3 font-semibold">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="hover-scale hover-tilt animate-float py-1 px-2"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 animate-rotate-in" /> : <Moon className="h-4 w-4 animate-rotate-in" />}
            </Button>
            <Button variant="ghost" size="sm" className="hover-scale hover-tilt animate-float py-1 px-2" asChild>
              <a href="/notifications">
                <Bell className="h-4 w-4 mr-2 animate-shake" />
                Notifications
              </a>
            </Button>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hover-scale hover-shine animate-bounce-in py-1 px-2">
                    <User className="h-4 w-4 mr-2 animate-pulse" />
                    {user?.name}
                    {isAdmin && <Shield className="h-3 w-3 ml-1 text-red-500" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-xs">
                          {user?.role}
                        </Badge>
                        {isAdmin && <Badge variant="outline" className="text-xs">Admin</Badge>}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/dashboard">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
            <Button variant="outline" size="sm" className="hover-scale hover-shine animate-bounce-in py-1 px-2" asChild>
              <a href="/login">
                <User className="h-4 w-4 mr-2 animate-pulse" />
                Login
              </a>
            </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-scale animate-pulse-glow animate-zoom-in py-1 px-2" asChild>
                  <a href="/register">إنشاء حساب</a>
            </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="hover-scale animate-rotate-in">
                <Menu className="h-6 w-6 animate-wave" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 animate-slide-in-right dark:bg-gray-900">
              <div className="flex flex-col space-y-4 mt-8">
                <Button 
                  variant="ghost" 
                  onClick={toggleTheme}
                  className="justify-start hover-scale"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4 ml-2" /> : <Moon className="h-4 w-4 ml-2" />}
                  {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
                </Button>
                
                {isAuthenticated && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4" />
                      <span className="font-semibold">{user?.name}</span>
                      {isAdmin && <Shield className="h-3 w-3 text-red-500" />}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant={isAdmin ? "destructive" : "secondary"} className="text-xs">
                        {user?.role}
                      </Badge>
                      {isAdmin && <Badge variant="outline" className="text-xs">Admin</Badge>}
                    </div>
                  </div>
                )}
                
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover-scale animate-fade-in-up stagger-${index + 1} flex items-center`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    {item.name}
                  </a>
                ))}
                
                <div className="border-t pt-4 space-y-3 animate-fade-in">
                  {isAuthenticated ? (
                    <>
                      <Button variant="outline" className="w-full hover-scale hover-tilt" asChild>
                        <a href="/dashboard">
                          <Settings className="h-4 w-4 mr-2 animate-pulse" />
                          Dashboard
                        </a>
                      </Button>
                      <Button variant="outline" className="w-full hover-scale hover-tilt" asChild>
                        <a href="/settings">
                          <Settings className="h-4 w-4 mr-2 animate-pulse" />
                          Settings
                        </a>
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full hover-scale hover-tilt"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2 animate-pulse" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                  <Button variant="outline" className="w-full hover-scale hover-tilt" asChild>
                    <a href="/login">
                      <User className="h-4 w-4 mr-2 animate-pulse" />
                      Login
                    </a>
                  </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-scale animate-pulse-glow" asChild>
                        <a href="/register">إنشاء حساب</a>
                  </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
