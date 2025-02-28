import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, User, LogIn, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Compass className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">TourEase</span>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tours" className="text-gray-600 hover:text-blue-600">
              Tours
            </Link>
            <Link to="/login" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>

        {/* Mobile menu - Updated with transitions */}
        <div
          className={`${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
            } md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100`}
        >
          <div className="py-4 space-y-4">
            <Link
              to="/tours"
              className="block px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
            >
              Tours
            </Link>
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
            >
              <LogIn className="h-5 w-5" />
              <span>Login</span>
            </Link>
            <Link
              to="/register"
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <User className="h-5 w-5" />
              <span>Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;