import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { healthCheck } from '../services/api';

const Navbar = () => {
  const location = useLocation();
  const [demoMode, setDemoMode] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await healthCheck();
        setDemoMode(response.data.demo_mode);
      } catch (error) {
        console.error('Failed to check health:', error);
      }
    };
    checkHealth();
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/sectors', label: 'Sectors' },
    { path: '/recommendations', label: 'Recommendations' },
    { path: '/macro', label: 'Macro View' },
    { path: '/portfolio', label: 'Portfolio' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-primary-surface border-b border-primary-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">α</span>
            </div>
            <span className="text-xl font-bold text-text-primary">Alpha Oracle</span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-accent-blue text-white'
                    : 'text-text-secondary hover:text-text-primary hover:bg-primary-hover'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className={`text-xs ${demoMode ? 'text-accent-yellow' : 'text-accent-green'}`}>
              <span className={`inline-block w-2 h-2 ${demoMode ? 'bg-accent-yellow' : 'bg-accent-green'} rounded-full ${demoMode ? '' : 'animate-pulse'} mr-2`}></span>
              {demoMode ? 'Demo Mode' : 'Live Data'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
