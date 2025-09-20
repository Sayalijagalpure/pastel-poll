import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { Vote, Menu, User, LogOut, Settings, BarChart3, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navigationItems = [
    { name: 'Home', href: '/', icon: Vote },
    { name: 'Polls', href: '/dashboard', icon: BarChart3 },
    ...(user?.role === 'admin' ? [{ name: 'Admin', href: '/admin', icon: Shield }] : []),
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Vote className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">SecureVote</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuLink asChild>
                      <Link
                        to={item.href}
                        className={cn(
                          "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                          isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role || 'voter'}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  {user?.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin Panel
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/role-selection')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/role-selection')}>
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Vote className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl">SecureVote</span>
                    <div className="ml-auto">
                      <ThemeToggle />
                    </div>
                  </div>
                  
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center space-x-2 text-lg font-medium py-2 px-3 rounded-md transition-colors hover:bg-accent",
                          isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                  
                  {!user && (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <Button variant="ghost" onClick={() => {
                        navigate('/role-selection');
                        setIsOpen(false);
                      }}>
                        Sign In
                      </Button>
                      <Button onClick={() => {
                        navigate('/role-selection');
                        setIsOpen(false);
                      }}>
                        Get Started
                      </Button>
                    </div>
                  )}
                  
                  {user && (
                    <div className="flex flex-col gap-2 pt-4 border-t">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role || 'voter'}</p>
                      </div>
                      <Button variant="ghost" onClick={() => {
                        navigate('/dashboard');
                        setIsOpen(false);
                      }}>
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Button>
                      {user?.role === 'admin' && (
                        <Button variant="ghost" onClick={() => {
                          navigate('/admin');
                          setIsOpen(false);
                        }}>
                          <Settings className="mr-2 h-4 w-4" />
                          Admin Panel
                        </Button>
                      )}
                      <Button variant="ghost" onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
