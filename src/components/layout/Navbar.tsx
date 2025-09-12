import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  Shield, 
  MapPin, 
  Mountain, 
  Tent, 
  Backpack, 
  Calendar, 
  Globe, 
  ArrowRight 
} from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTripsDropdownOpen, setIsTripsDropdownOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAdmin();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const tripItems = [
    { name: "Upcoming Trips", path: "/upcoming" },
    { name: "Weekend Getaways", path: "/weekends" },
    { name: "Backpacking Trips", path: "/backpacking" },
    { name: "Camping", path: "/camping" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isTripActive = () => {
    return tripItems.some(item => isActive(item.path));
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <img 
                src="/tat-logo-removebg.png" 
                alt="Trek A Tour Logo" 
                className="w-[200px] h-[200px] object-contain transition-transform group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/")
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                Home
              </Link>
              
              {/* Trips Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsTripsDropdownOpen(true)}
                onMouseLeave={() => setIsTripsDropdownOpen(false)}
              >
                <span
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isTripActive()
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  Trips
                </span>
                
                {/* Smooth Dropdown Menu */}
                <div className={`absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-out ${
                  isTripsDropdownOpen 
                    ? 'opacity-100 visible transform translate-y-0' 
                    : 'opacity-0 invisible transform -translate-y-2'
                }`}>
                  <div className="py-2">
                    {tripItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`block px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                          isActive(item.path)
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* International Gateways */}
              <Link
                to="/international"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive("/international")
                    ? "text-orange-600"
                    : "text-gray-700 hover:text-orange-600"
                }`}
              >
                International Gateways
              </Link>

              {/* Other Nav Items */}
              {navItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Login/Panel Button */}
              {isAdmin ? (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                    isActive("/admin")
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              ) : (
                <Link
                  to="/admin-login"
                  className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                    isActive("/admin-login")
                      ? "text-orange-600"
                      : "text-gray-700 hover:text-orange-600"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Admin Login
                </Link>
              )}
            </div>

            {/* Auth & Mobile Menu */}
            <div className="flex items-center space-x-4">
              {/* Admin Login/Panel Button */}
              {isAdmin ? (
                <Link to="/admin">
                  <Button 
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Panel
                  </Button>
                </Link>
              ) : (
                <Link to="/admin-login">
                  <Button 
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admin Login
                  </Button>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden border-t border-gray-100">
              <div className="py-4 space-y-1">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                    isActive("/")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  Home
                </Link>
                
                {/* Mobile Trips Section */}
                <div className="px-4 py-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Trips
                  </div>
                  <div className="space-y-1 ml-4">
                    {tripItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={`block px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                          isActive(item.path)
                            ? "text-orange-600 bg-orange-50"
                            : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                
                {/* International Gateways - Mobile */}
                <Link
                  to="/international"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                    isActive("/international")
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                  }`}
                >
                  International Gateways
                </Link>
                
                {/* Other Nav Items */}
                {navItems.slice(1).map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Admin Login/Panel - Mobile */}
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                      isActive("/admin")
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/admin-login"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 ${
                      isActive("/admin-login")
                        ? "text-orange-600 bg-orange-50"
                        : "text-gray-700 hover:text-orange-600 hover:bg-gray-50"
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin Login
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;