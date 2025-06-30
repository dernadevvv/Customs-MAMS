import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthPage from './SignUp';
import { 
  Home,    
  BarChart2, 
  Users, 
  Settings, 
  Calendar, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  ChevronRight,
  Trophy,
  Menu, 
  User, 
  Newspaper,
  LayoutDashboard,
  List,
  PieChart,
  ListChecks,
  LogIn,
  LogOut,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Trophy, label: 'Leaderboard' , path: '/leaderboard' },
    { icon: PieChart, label: 'Dashboard' , path: '/analytics' },
    { icon: ListChecks, label: 'Events' , path: '/team' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
    { icon: Newspaper, label: 'News' , path: '/documents'},
    { icon: HelpCircle, label: 'Help & Support' , path: '/help'},
  ];

  const handleAuthClick = () => {
    if (isSignedIn) {
      setIsSignedIn(false);
      setUserData(null);
    } else {
      setShowAuthPage(true);
    }
  };

  const handleSignIn = (formData: any) => {
    setUserData(formData);
    setIsSignedIn(true);
    setShowAuthPage(false);
    console.log('User signed in:', formData);
  };

  const handleCloseAuth = () => {
    setShowAuthPage(false);
  };

  return (
    <>
      <div 
              className={`fixed inset-0 z-20 bg-gray-900/50 transition-opacity duration-300 ${
                isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`} 
              onClick={onClose}
            ></div>
            
            <aside 
              className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out transform ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              } w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800`}
            >
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-md overflow-hidden">
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/72/Seal_of_the_Ministry_of_Finance_of_Thailand.svg" 
                      alt="Logo" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="ml-2 text-xl font-semibold text-gray-800 dark:text-white">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MAMS</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
        {/* User Info Section */}
        {isSignedIn && userData && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                {userData.picture ? (
                  <img
                    src={URL.createObjectURL(userData.picture)}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    {userData.fullname?.charAt(0) || 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userData.fullname} {userData.lastname}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userData.position}
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  if (onClose) onClose();
                }}
                className={`w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon 
                  size={18} 
                  className={`mr-3 ${
                    location.pathname === item.path
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }`} 
                />
                {item.label}
                {location.pathname === item.path && (
                  <ChevronRight size={16} className="ml-auto text-blue-600 dark:text-blue-400" />
                )}
              </button>
            ))}
          </nav>

          <div className="mt-4">
            <div className="my-4 h-px bg-gray-200 dark:bg-gray-700" />
            <button
              onClick={handleAuthClick}
              className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              {isSignedIn ? (
                <>
                  <LogOut size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                  Sign Out
                </>
              ) : (
                <>
                  <LogIn size={18} className="mr-3 text-gray-500 dark:text-gray-400" />
                  Sign In
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Authentication Modal */}
      {showAuthPage && (
        <AuthPage onClose={handleCloseAuth} onSignIn={handleSignIn} />
      )}
    </>
  );
};

export default Sidebar;

{/* <div className="h-8 w-8 bg-blue-600 rounded-md flex items-center justify-center">
              <BarChart2 size={20} className="text-white" />
            </div> */}