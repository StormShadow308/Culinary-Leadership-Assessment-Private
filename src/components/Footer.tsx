
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Dashboards
            </h3>
            <div className="mt-4 space-y-4">
              <Link
                to="/admin-dashboard"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/org-dashboard"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Organization Dashboard
              </Link>
              <Link
                to="/participant-dashboard"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Participant Dashboard
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Support
            </h3>
            <div className="mt-4 space-y-4">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Help Center
              </a>
              <a
                href="#"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Legal
            </h3>
            <div className="mt-4 space-y-4">
              <a
                href="#"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-base text-gray-500 hover:text-brand-orange block transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">
            © 2024 Transformational Leadership Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
