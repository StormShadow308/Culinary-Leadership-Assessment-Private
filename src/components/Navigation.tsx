import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-lg z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/lovable-uploads/1dbcf1e6-bf8d-4e4f-ab7f-896cc95c63cd.png"
                alt="Logo"
                className="h-12 w-auto" /* Increased from h-8 to h-12 */
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/culinary-leadership" className="text-gray-700 hover:text-brand-orange transition-colors">
              Culinary Leadership
            </Link>
            <Link to="/coaching" className="text-gray-700 hover:text-brand-orange transition-colors">
              Coaching
            </Link>
            <Link to="/newsletter" className="text-gray-700 hover:text-brand-orange transition-colors">
              Newsletter
            </Link>
            <Link to="/assessment" className="text-gray-700 hover:text-brand-orange transition-colors font-medium">
              Take Assessment
            </Link>
            <Link to="/admin-dashboard" className="text-gray-700 hover:text-brand-orange transition-colors">
              Admin
            </Link>
            <Link to="/org-dashboard" className="text-gray-700 hover:text-brand-orange transition-colors">
              Organization
            </Link>
            <Link to="/participant-dashboard" className="text-gray-700 hover:text-brand-orange transition-colors">
              Participant
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/culinary-leadership"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Culinary Leadership
              </Link>
              <Link
                to="/coaching"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Coaching
              </Link>
              <Link
                to="/newsletter"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Newsletter
              </Link>
              <Link
                to="/assessment"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Take Assessment
              </Link>
              <Link
                to="/admin-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Link
                to="/org-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Organization
              </Link>
              <Link
                to="/participant-dashboard"
                className="block px-3 py-2 text-gray-700 hover:text-brand-orange transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Participant
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
