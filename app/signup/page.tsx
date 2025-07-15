"use client";
import { useState, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, Check, X, Phone } from 'lucide-react';

import { supabase } from '@/utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const router = useRouter();
  const element_unique_id = useId();

  // Password validation
  const hasMinLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!fullName.trim()) {
      setError('Please enter your full name');
      
return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email address');
      
return;
    }
    
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      
return;
    }
    
    if (!password) {
      setError('Please enter a password');
      
return;
    }
    
    if (!hasMinLength || !hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      setError('Password does not meet the requirements');
      
return;
    }
    
    if (!passwordsMatch) {
      setError('Passwords do not match');
      
return;
    }
    
    setLoading(true);
    
    try {
      // Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phoneNumber,
          },
        },
      });
      
      if (signUpError) throw signUpError;
      
      if (data?.user) {
        // Create profile in backend via API
        const res = await fetch(API_ENDPOINTS.createProfile, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uuid: data.user.id,
            full_name: fullName,
            email: email,
            phone: phoneNumber,
            avatar_url: data.user.user_metadata?.avatar_url || '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Failed to create user profile');
        }
        setSuccess('Account created successfully! Please check your email to confirm your account.');
        
        // Redirect after a delay
        setTimeout(() => {
          router.push('/');
        }, 3000);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Initiate Google OAuth sign-in
      // Profile creation will be handled in the auth/callback page
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        throw error;
      }
      
      // No need to handle profile creation here as it's done in the callback page
    } catch (error: any) {
      setError(error.message || 'Failed to sign up with Google');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Decorative Header */}
      <div className="relative h-24 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600">
        <div className="h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-white bg-white p-2 shadow-md">
          <div className="relative size-10">
            <Image 
              src="/assets/logo_Without_Text.png" 
              alt="Plantomart Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Join PlantoMart and start your green journey today
            </p>
          </div>
          {error && (
            <div className="mb-6 rounded-md border-l-4 border-red-500 bg-red-50 p-4">
              <div className="flex items-center">
                <AlertCircle className="mr-3 size-5 text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-md border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-center">
                <Check className="mr-3 size-5 text-green-500" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}
          <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="px-6 py-8">
              <form className="space-y-6" onSubmit={handleEmailSignUp}>
                {/* Full Name */}
                <div>
                  <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id={element_unique_id}
                      name="full-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-black placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id={element_unique_id}
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-black placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id={element_unique_id}
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-black placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>
                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id={element_unique_id}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border border-gray-300 px-10 py-3 text-black placeholder:text-gray-400 focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {/* Password Requirements */}
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs">
                      <div className={`mr-2 flex size-4 items-center justify-center rounded-full ${hasMinLength ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {hasMinLength ? <Check className="size-3" /> : null}
                      </div>
                      <span className={hasMinLength ? 'text-green-700' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`mr-2 flex size-4 items-center justify-center rounded-full ${hasUpperCase ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {hasUpperCase ? <Check className="size-3" /> : null}
                      </div>
                      <span className={hasUpperCase ? 'text-green-700' : 'text-gray-500'}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`mr-2 flex size-4 items-center justify-center rounded-full ${hasLowerCase ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {hasLowerCase ? <Check className="size-3" /> : null}
                      </div>
                      <span className={hasLowerCase ? 'text-green-700' : 'text-gray-500'}>
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`mr-2 flex size-4 items-center justify-center rounded-full ${hasNumber ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {hasNumber ? <Check className="size-3" /> : null}
                      </div>
                      <span className={hasNumber ? 'text-green-700' : 'text-gray-500'}>
                        Number
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className={`mr-2 flex size-4 items-center justify-center rounded-full ${hasSpecialChar ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        {hasSpecialChar ? <Check className="size-3" /> : null}
                      </div>
                      <span className={hasSpecialChar ? 'text-green-700' : 'text-gray-500'}>
                        Special character
                      </span>
                    </div>
                  </div>
                </div>
                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
                    <input
                      id={element_unique_id}
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full rounded-md border px-10 py-3 text-black placeholder:text-gray-400 focus:outline-none sm:text-sm ${
                        confirmPassword && !passwordsMatch
                          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                          : confirmPassword && passwordsMatch
                          ? 'border-green-300 focus:border-green-500 focus:ring-green-500'
                          : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                    {confirmPassword && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        {passwordsMatch ? (
                          <Check className="size-5 text-green-500" />
                        ) : (
                          <X className="size-5 text-red-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create account'
                    )}
                  </button>
                </div>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="mt-6">
                  {/** biome-ignore lint/a11y/useButtonType: Need to look-on is it required or not here */}
                  <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
                  >
                    <svg className="mr-2 size-5" viewBox="0 0 24 24">
                      <title>Sign up with Google</title>
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                      </g>
                    </svg>
                    Sign up with Google
                  </button>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/" className="font-medium text-green-600 hover:text-green-500">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-gray-500">
            By signing up, you agree to our{' '}
            <Link href="#" className="text-green-600 hover:text-green-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="text-green-600 hover:text-green-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}