'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FiChevronDown, FiMenu, FiX, FiLogIn } from 'react-icons/fi';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LogOut, User, Building } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  // Get user display name
  const getUserDisplayName = (): string => {
    if (!session?.user) return '';

    if (session.user.role === 'business' && session.user.companyName) {
      return session.user.companyName;
    }

    if (
      (session.user.role === 'candidate' ||
        session.user.role === 'employee' ||
        session.user.role === 'admin') &&
      session.user.firstName &&
      session.user.lastName
    ) {
      return `${session.user.firstName} ${session.user.lastName}`;
    }

    return session.user.email.split('@')[0];
  };

  // Get avatar color and letter based on role
  const getAvatarInfo = () => {
    if (!session?.user)
      return { icon: <User className="h-5 w-5" />, color: 'bg-gray-500' };

    const displayName = getUserDisplayName();
    const initial = displayName ? displayName.charAt(0).toUpperCase() : '?';

    switch (session.user.role) {
      case 'business':
        return {
          icon: <Building className="h-5 w-5" />,
          color: 'bg-globixs-primary',
        };
      case 'candidate':
        return {
          initial,
          color: 'bg-globixs-secondary',
        };
      case 'employee':
      case 'admin':
      default:
        return {
          initial,
          color: 'bg-globixs-primary',
        };
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if the current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return null; // Hide the Navbar in admin routes
  }

  const avatarInfo = getAvatarInfo();

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-globixs-bgAccent backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/logo_globix.png"
                alt="Globixs Logo"
                width={250}
                height={250}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-4xl mx-8">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/about-us"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/services"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Services
              </Link>
              <Link
                href="/industries"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Industries
              </Link>
              <Link
                href="/careers"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Careers
              </Link>
              <Link
                href="/media"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Media
              </Link>
              <Link
                href="/contact-us"
                className="text-black hover:text-globixs-primary transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
            {/* Show either Login Portal button or User Profile based on authentication status */}
            {status === 'authenticated' ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-globixs-primary transition-colors"
                >
                  <div
                    className={`w-8 h-8 ${avatarInfo.color} rounded-full flex items-center justify-center text-white`}
                  >
                    {avatarInfo.icon || <span>{avatarInfo.initial}</span>}
                  </div>
                  <span className="max-w-[150px] truncate">
                    {getUserDisplayName()}
                  </span>
                  <FiChevronDown
                    className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {session?.user?.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize mt-1">
                        {session?.user?.role} Account
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>

                    <Link
                      href="/logout"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <Button className="bg-gradient-to-r from-globixs-primary to-globixs-secondary text-white hover:opacity-90 flex items-center gap-1">
                <Link href="/login" className="flex items-center">
                  <FiLogIn className="w-4 h-4 mr-3" />
                  Login Portal
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile View - Profile/Avatar and Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            {status === 'authenticated' && (
              <div className="relative">
                <button onClick={toggleUserMenu} className="flex items-center">
                  <div
                    className={`w-8 h-8 ${avatarInfo.color} rounded-full flex items-center justify-center text-white`}
                  >
                    {avatarInfo.icon || (
                      <span className="text-sm font-medium">
                        {avatarInfo.initial}
                      </span>
                    )}
                  </div>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {session?.user?.email}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Profile
                    </Link>

                    <Link
                      href="/logout"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                    >
                      Log Out
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              className="p-2 text-black hover:text-globixs-primary transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            {/* User Profile section (if logged in) */}
            {status === 'authenticated' && (
              <div className="mb-2 pb-3 border-b border-gray-200">
                <div className="flex items-center space-x-3 mb-2">
                  <div
                    className={`w-10 h-10 ${avatarInfo.color} rounded-full flex items-center justify-center text-white`}
                  >
                    {avatarInfo.icon || (
                      <span className="text-lg font-medium">
                        {avatarInfo.initial}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {session.user.role} Account
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  <Link
                    href="/profile"
                    className="text-sm text-globixs-primary hover:text-globixs-primary/80 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/logout"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Log Out
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <Link
              href="/"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/about-us"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About Us
            </Link>

            <Link
              href="/services"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>

            <Link
              href="/industries"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Industries
            </Link>

            <Link
              href="/careers"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Careers
            </Link>

            <Link
              href="/media"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Media
            </Link>

            <Link
              href="/contact-us"
              className="block text-black hover:text-globixs-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            {/* Login button (if not logged in) */}
            {status !== 'authenticated' && (
              <div className="pt-3 mt-2 border-t border-gray-200">
                <Link
                  href="/login"
                  className="w-full bg-gradient-to-r from-globixs-primary to-globixs-secondary text-white hover:opacity-90 
                           rounded-md px-4 py-2 flex items-center justify-center gap-2 transition-opacity"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <FiLogIn className="w-4 h-4" />
                  Login Portal
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
