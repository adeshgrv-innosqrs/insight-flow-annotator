import { LogOut, User, Search, BarChart3, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = ({ user, onLogout }) => {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Left side - Logo and title */}
      <div className="flex items-center space-x-4">
        <div className="bg-primary p-2 rounded">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">ARGOS</h1>
        </div>
      </div>

      {/* Right side - User info and actions */}
      <div className="flex items-center space-x-6">
        {/* Session active indicator */}
        <div className="flex items-center space-x-2 text-sm bg-green-500 text-white rounded-full px-3 py-1 ml-6">
          <BarChart3 className="h-4 w-4" />
          <span>Session Active</span>
        </div>

        {/* User info */}
        <div className="flex items-center space-x-4 mr-10">
          {/* Avatar */}
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>

          {/* Name and email */}
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
