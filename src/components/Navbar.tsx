import React, { useState, useEffect, useRef } from 'react';
import { Menu, Bell, Search, User, Settings, LogOut, UserCircle, HelpCircle, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };
    
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) && 
          !(event.target as Element).closest('.search-button')) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lastScrollY]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleProfileClick = (path?: string) => {
    setIsProfileOpen(false);
    if (path) {
      navigate(path);
    }
  };
  const handleSignOut = async () => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userID = user?.UserID;
    const timestamp = new Date().toISOString();

    if (userID) {
      try {
        await fetch('http://localhost:5000/api/log-signout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID, timestamp })
        });
      } catch (err) {
        console.error('⚠️ Logging sign-out failed:', err);
      }
    }

    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionStart');
    navigate('/');
  };

  


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  return (
    <nav 
      className={`fixed top-0 right-0 left-0 z-30 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      } ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1" />

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={toggleSearch}
                className="search-button p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
                aria-label="Toggle search"
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
              
              <form 
                onSubmit={handleSearch}
                className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isSearchOpen
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none'
                } ${
                  isSearchOpen ? 'md:w-[300px] sm:w-[250px] w-[200px] -right-2' : 'w-0'
                }`}
              >
                <div className="relative w-full">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-4 pr-10 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-700 focus:ring-0 text-sm transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label="Submit search"
                  >
                    <Search size={16} />
                  </button>
                </div>
              </form>
            </div>
            
            <ThemeToggle />

            <button 
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none relative"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="ml-3 relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src="https://ih1.redbubble.net/image.2539872835.1769/bg,f8f8f8-flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">ID:</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">ชื่อ นามสกุล</p>
                  </div>
                  
                  <button
                    onClick={() => handleProfileClick('/profile')}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <UserCircle size={16} className="mr-2" />
                    โปรไฟล์ของคุณ
                  </button>
                  
                  
                  
                  <button
                    onClick={() => handleProfileClick('/help')}
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                  >
                    <HelpCircle size={16} className="mr-2" />
                    ศูนย์ช่วยเหลือ
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => handleSignOut()}
                      className="w-full px-4 py-2 text-sm text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;