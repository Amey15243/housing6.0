import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Chrome as Home, Search, Heart, User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-md sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900">PremiumEstate</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Home
            </Link>
            <Link
              to="/properties"
              className="text-gray-700 hover:text-blue-600 transition font-medium"
            >
              Properties
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1"
            >
              <Search size={18} />
              Search
            </Link>
            {user && (
              <Link
                to="/favorites"
                className="text-gray-700 hover:text-blue-600 transition font-medium flex items-center gap-1"
              >
                <Heart size={18} />
                Favorites
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
                >
                  <User size={20} />
                  <span className="font-medium">Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
