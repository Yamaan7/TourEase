import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">About TourEase</h3>
            <p className="mb-4">
              Discover the world with TourEase. We offer unique travel experiences
              with expert local guides, ensuring unforgettable adventures around the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tours" className="hover:text-white transition-colors">
                  Browse Tours
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Travel Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">Paris, France</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Tokyo, Japan</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Rome, Italy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">New York, USA</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">Barcelona, Spain</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <Phone size={20} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={20} />
                <span>contact@tourease.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={20} />
                <span>123 Travel Street, Adventure City, TC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <p className="text-center">
            © {new Date().getFullYear()} TourEase. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;