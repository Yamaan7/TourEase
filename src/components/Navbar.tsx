import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, LogIn, Menu, X, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-red-500', 'bg-green-500',
      'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Update the getInitial function
  const getInitial = (user: any) => {
    if (!user) return '?';

    // Check for different user types and their name properties
    const name = user.name || user.agencyName || user.email;
    return name?.charAt(0)?.toUpperCase() || '?';
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // useEffect(() => {
  //   const storedUser = localStorage.getItem('user');
  //   if (storedUser) {
  //     setUser(JSON.parse(storedUser));
  //   }
  // }, []);

  useEffect(() => {
    // Initial user check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem('user');
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      } else {
        setUser(null);
      }
    };

    // Add event listener
    window.addEventListener('authChange', handleAuthChange);

    // Cleanup
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // In Navbar.tsx handleLogout function:
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    window.dispatchEvent(new Event('authChange')); // Add this line
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/home" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">TourEase</span>
          </Link>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tours" className="text-gray-600 hover:text-blue-600">Tours</Link>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${getRandomColor()}`}
                >
                  {getInitial(user)}
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-1">
                    <Link
                      to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
                    >
                      <Settings className="h-5 w-5" />
                      <span>{user?.role === 'admin' ? 'Admin Dashboard' : 'Profile Settings'}</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-gray-100 w-full"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
                <Link to="/register" className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <User className="h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div
            className={`${isMenuOpen ? 'block' : 'hidden'
              } md:hidden absolute top-16 left-0 right-0 bg-white shadow-md`}
          >
            <div className="px-4 py-2 space-y-2">
              {user && (
                <div className="flex items-center space-x-3 py-2 border-b border-gray-200">
                  <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center text-sm font-medium ${getRandomColor()}`}>
                    {getInitial(user)}
                  </div>
                  <span className="text-gray-700 font-medium">{user.name}</span>
                </div>
              )}
              <Link
                to="/tours"
                onClick={closeMenu}
                className="block py-2 text-gray-600 hover:text-blue-600"
              >
                Tours
              </Link>
              {user ? (
                <>
                  <Link
                    to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={closeMenu}
                    className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <Settings className="h-5 w-5" />
                    <span>{user?.role === 'admin' ? 'Admin Dashboard' : 'Profile Settings'}</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="flex items-center space-x-2 w-full py-2 text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="flex items-center space-x-2 py-2 text-gray-600 hover:text-blue-600"
                  >
                    <User className="h-5 w-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;