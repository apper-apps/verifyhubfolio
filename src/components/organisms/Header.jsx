import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: "Dashboard", path: "/", icon: "BarChart3" },
    { name: "Single Verify", path: "/single", icon: "Mail" },
    { name: "Bulk Verify", path: "/bulk", icon: "FileText" },
    { name: "History", path: "/history", icon: "Clock" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                <ApperIcon name="ShieldCheck" className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  VerifyHub
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Email Verification</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigationItems.map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  <ApperIcon name={item.icon} className="w-4 h-4 mr-2" />
                  {item.name}
                </motion.button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                    <ApperIcon name="ShieldCheck" className="w-5 h-5 text-white" />
                  </div>
                  <div className="ml-3">
                    <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      VerifyHub
                    </h1>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </Button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20"
                        : "text-gray-600 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <ApperIcon name={item.icon} className="w-5 h-5 mr-3" />
                    <span className="font-medium">{item.name}</span>
                  </motion.button>
                ))}
              </nav>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Header;