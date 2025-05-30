import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ClipboardList } from 'lucide-react';
import Button from './ui/Button';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <span 
              className="ml-2 font-bold text-xl cursor-pointer"
              onClick={() => navigate('/')}
            >
              AttendEase
            </span>
          </div>
          
          <div className="flex items-center">
            {state.isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-700 mr-4">
                  {state.user?.companyName}
                </span>
                <Button
                  variant="ghost"
                  onClick={logout}
                  leftIcon={<LogOut className="h-4 w-4" />}
                  size="sm"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="mr-2"
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;