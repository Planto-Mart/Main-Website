/* eslint-disable tailwindcss/migration-from-tailwind-2 */
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, X, Info } from 'lucide-react';

import { supabase } from '@/utils/supabase/client';

interface SignInProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface for IP geolocation data
interface GeoLocation {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  postal?: string;
  timezone?: string;
}

const SignIn: React.FC<SignInProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);

  const router = useRouter();

  // Close modal when escape key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Function to get the user's IP address and geolocation
  const getIpAndLocation = async (): Promise<GeoLocation | null> => {
    try {
      // First get the IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      const IP_INFO_TOKEN = process.env.NEXT_PUBLIC_IP_INFO_TOKEN || 'db04343f368c67'; // Replace with your actual token
      
      // Then get geolocation data
      const geoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=${IP_INFO_TOKEN}`);
      const geoData = await geoResponse.json();
      
      return {
        ip,
        city: geoData.city,
        region: geoData.region,
        country: geoData.country,
        loc: geoData.loc,
        org: geoData.org,
        postal: geoData.postal,
        timezone: geoData.timezone
      };
    } catch (error) {
      console.error('Error fetching IP or location:', error);
      
      return null;
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setAccountNotFound(false);
    const locationInfo = await getIpAndLocation();

    try {
      // Attempt to sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        // Check if user exists in profiles_dev table using uuid column
        const { data: profileData, error: profileError } = await supabase
          .from('profiles_dev')
          .select('*')
          .eq('uuid', data.user.id)  // Use 'uuid' column instead of 'id'
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
        }

        if (!profileData) {
          // User exists in auth but not in profiles_dev table
          // Create a new profile
          const { error: insertError } = await supabase
            .from('profiles_dev')
            .insert({
              uuid: data.user.id,  // Store user ID in the uuid column
              full_name: data.user.user_metadata?.full_name || '',
              email: data.user.email || '',
              phone: data.user.user_metadata?.phone || '',
              avatar_url: data.user.user_metadata?.avatar_url || '',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_login_info: {
                last_sign_in: new Date().toISOString(),
                sign_in_count: 1,
                sign_in_method: 'email'
              }
            });

          if (insertError) {
            console.error('Error creating profile:', insertError);
          }
        } else {
          // Update existing profile with login information
          const currentLoginInfo = profileData.user_login_info || {};
          const signInCount = (currentLoginInfo.sign_in_count || 0) + 1;

          const { error: updateError } = await supabase
            .from('profiles_dev')
            .update({
              updated_at: new Date().toISOString(),
              user_login_info: {
                ...currentLoginInfo,
                last_sign_in: new Date().toISOString(),
                sign_in_count: signInCount,
                sign_in_method: 'email',  // Changed from 'google' to 'email'
                ip_address: locationInfo?.ip || currentLoginInfo.ip_address || 'unknown',
                location: locationInfo ? {
                  city: locationInfo.city || 'unknown',
                  region: locationInfo.region || 'unknown',
                  country: locationInfo.country || 'unknown',
                  coordinates: locationInfo.loc || 'unknown',
                  timezone: locationInfo.timezone || 'unknown'
                } : currentLoginInfo.location || 'unknown'
              }
            })
            .eq('uuid', data.user.id);  // Use 'uuid' column instead of 'id'

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }

        // Close modal and refresh page after successful sign-in
        onClose();
        router.refresh();
      }
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        // Set account not found message
        setAccountNotFound(true);
        setError('Account not found. Please create an account to continue.');
      } else {
        setError(error.message || 'Failed to sign in');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Initiate Google OAuth sign-in
      // Profile creation/update will be handled in the auth/callback page
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            // Pass additional data to be used in the callback
            prompt: 'select_account', // Force account selection even if already logged in
            access_type: 'offline' // Get refresh token for server-side use
          }
        },
      });

      if (error) {
        throw error;
      }

      // The auth callback page will handle profile creation/update
    } catch (error: any) {
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address');

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage('Password reset link sent to your email');
    } catch (error: any) {
      setError(error.message || 'Failed to send reset password email');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      {/* Modal Content */}
      <div className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
        <div className="relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div className="text-center">
            <div className="flex justify-center">
              <div className="relative size-16">
                <Image
                  src="/assets/logo_Without_Text.png"
                  alt="Plantomart Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-green-600 hover:text-green-500">
                Sign up
              </Link>
            </p>
          </div>
          {error && (
            <div className="mt-4 rounded border-l-4 border-red-500 bg-red-50 p-3">
              <div className="flex items-center">
                <AlertCircle className="mr-2 size-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              {accountNotFound && (
                <div className="mt-2 flex items-center">
                  <Info className="mr-2 size-4 text-blue-500" />
                  <p className="text-xs text-blue-700">
                    <Link href="/signup" className="font-medium underline">
                      Sign up now
                    </Link> to create a new account.
                  </p>
                </div>
              )}
            </div>
          )}
          {message && (
            <div className="mt-4 rounded border-l-4 border-green-500 bg-green-50 p-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}
          <form className="mt-6 space-y-6" onSubmit={handleEmailSignIn}>
            <div className="rounded-md shadow-sm">
              <div className="relative mb-4">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-10 py-3 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Password</label>
                <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full appearance-none rounded-md border border-gray-300 px-10 py-3 placeholder-gray-500 focus:z-10 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transform"
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-gray-400" />
                  ) : (
                    <Eye className="size-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="size-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Forgot your password?
              </button>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : null}
                Sign in
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
              >
                <svg className="mr-2 size-5" viewBox="0 0 24 24">
                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                  </g>
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;