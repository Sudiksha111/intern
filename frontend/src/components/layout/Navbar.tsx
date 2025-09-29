import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NotebookPen, User, LogOut, Crown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/notes" className="flex items-center space-x-3 hover:opacity-80 transition-smooth">
            <div className="p-2 bg-gradient-warm rounded-lg shadow-soft">
              <NotebookPen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">CozyNotes</h1>
              <p className="text-xs text-muted-foreground">{user.tenantName}</p>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Subscription Badge */}
            <Badge 
              variant={user.subscription === 'pro' ? 'default' : 'secondary'}
              className={user.subscription === 'pro' ? 'bg-gradient-warm' : ''}
            >
              {user.subscription === 'pro' ? (
                <><Sparkles className="h-3 w-3 mr-1" /> Pro</>
              ) : (
                'Free'
              )}
            </Badge>

            {/* Role Badge */}
            {user.role === 'admin' && (
              <Badge variant="outline" className="border-accent text-accent-foreground">
                <Crown className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            )}

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gradient-cool rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {user.role === 'admin' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/upgrade" className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Manage Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;