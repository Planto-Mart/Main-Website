"use client";
import type React from 'react';
import { useState, useEffect, useId } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Package, Heart, CreditCard, LogOut, Settings, Edit, Camera, 
  Truck, Clock, CheckCircle, AlertCircle, ChevronRight, ShoppingBag, 
  MapPin, Phone, Shield, Bell, HelpCircle, Loader2, Store, Activity,
  Globe, Calendar, MapPinned, Info, Lock
} from 'lucide-react';

import { supabase } from '../../utils/supabase/client';
import { API_ENDPOINTS } from '@/config/api';
import VendorRegister from '@/components/vendor/VendorRegister';

// Interface for user login info
interface UserLoginInfo {
  last_sign_in?: string;
  sign_in_count?: number;
  sign_in_method?: string;
  provider?: string;
  ip_address?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    coordinates?: string;
    timezone?: string;
  } | string;
}

// Modular Profile Info Form
function ProfileInfoForm({ profile, updatedProfile, onChange, onSave, saving, editMode, setEditMode, error, success, element_unique_id }: any) {
  return (
    <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <AlertCircle className="size-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <CheckCircle className="size-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
        <button
          type='button'
          onClick={() => setEditMode(!editMode)}
          className="flex items-center text-sm font-medium text-green-600 hover:text-green-700"
        >
          {editMode ? 'Cancel' : (<><Edit className="mr-1 size-4" />Edit</>)}
        </button>
      </div>
      {editMode ? (
        <form className="space-y-4 mt-6" onSubmit={onSave}>
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id={element_unique_id + '-full_name'}
              name="full_name"
              value={updatedProfile.full_name || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="avatar_url" className="block text-sm font-medium text-gray-700">Avatar URL</label>
            <input
              type="text"
              id={element_unique_id + '-avatar_url'}
              name="avatar_url"
              value={updatedProfile.avatar_url || ''}
              onChange={onChange}
              placeholder="https://..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id={element_unique_id + '-phone'}
              name="phone"
              value={updatedProfile.phone || ''}
              onChange={onChange}
              placeholder="+91 XXXXX XXXXX"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id={element_unique_id + '-address'}
              name="address"
              value={updatedProfile.address || ''}
              onChange={onChange}
              placeholder="Street, Area, etc."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id={element_unique_id + '-city'}
                name="city"
                value={updatedProfile.city || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                id={element_unique_id + '-state'}
                name="state"
                value={updatedProfile.state || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
              <input
                type="text"
                id={element_unique_id + '-pincode'}
                name="pincode"
                value={updatedProfile.pincode || ''}
                onChange={onChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email_notifications" className="block text-sm font-medium text-gray-700">Email Notifications</label>
            <select
              id={element_unique_id + '-email_notifications'}
              name="email_notifications"
              value={updatedProfile.email_notifications || ''}
              onChange={onChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            >
              <option value="">Select preference</option>
              <option value="enabled">Enabled</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              id={element_unique_id + '-bio'}
              name="bio"
              value={updatedProfile.bio || ''}
              onChange={onChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70"
            >
              {saving ? (<><Loader2 className="mr-2 size-4 animate-spin" />Saving...</>) : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.full_name || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.email || ''}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.phone || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.address || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">City</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.city || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">State</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.state || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.pincode || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email Notifications</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.email_notifications || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Bio</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.bio || 'Not provided'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1 text-sm text-gray-900">{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loginInfo, setLoginInfo] = useState<UserLoginInfo | null>(null);
  const [vendorStatus, setVendorStatus] = useState<'loading' | 'not_vendor' | 'is_vendor' | 'registering' | 'error'>(
    'loading'
  );
  const [vendorError, setVendorError] = useState<string | null>(null);
  const element_unique_id = useId();
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);
      // Fetch profile data from backend API
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(session.user.id), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) {
        throw new Error('Failed to fetch profile');
      }
      const profileJson = await res.json();
      if (!profileJson.success || !profileJson.data) {
        throw new Error(profileJson.message || 'Profile not found');
      }
      let profileData = profileJson.data;
      if (profileData.user_login_info && typeof profileData.user_login_info === 'string') {
        try {
          profileData.user_login_info = JSON.parse(profileData.user_login_info);
        } catch {}
      }
      setProfile(profileData);
      setUpdatedProfile(profileData);
      if (profileData?.user_login_info) {
        setLoginInfo(profileData.user_login_info);
      }
      // --- Vendor check logic ---
      setVendorStatus('loading');
      setVendorError(null);
      try {
        const vendorRes = await fetch(API_ENDPOINTS.getAllVendorsAdmin, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!vendorRes.ok) throw new Error('Failed to fetch vendor profiles');
        const vendorJson = await vendorRes.json();
        if (!vendorJson.success || !Array.isArray(vendorJson.data)) throw new Error(vendorJson.message || 'Vendor data error');
        // Try to match by user_uuid, user_id, or vendor_id
        const found = vendorJson.data.find((v: any) =>
          v.user_uuid === session.user.id ||
          v.user_id === session.user.id ||
          v.vendor_id === session.user.id
        );
        setVendorStatus(found ? 'is_vendor' : 'not_vendor');
      } catch (err: any) {
        setVendorStatus('error');
        setVendorError(err.message || 'Could not check vendor status');
      }
      // --- End vendor check logic ---
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const payload: any = {
        full_name: updatedProfile.full_name,
        avatar_url: updatedProfile.avatar_url,
        phone: updatedProfile.phone,
        address: updatedProfile.address,
        city: updatedProfile.city,
        state: updatedProfile.state,
        pincode: updatedProfile.pincode,
        email_notifications: updatedProfile.email_notifications,
        bio: updatedProfile.bio,
        updated_at: new Date().toISOString(),
      };
      let newLoginInfo = loginInfo || {};
      newLoginInfo.last_sign_in = new Date().toISOString();
      newLoginInfo.sign_in_count = (loginInfo?.sign_in_count || 0) + 1;
      newLoginInfo.sign_in_method = loginInfo?.sign_in_method || 'email';
      payload.user_login_info = newLoginInfo;
      const res = await fetch(API_ENDPOINTS.updateProfileByUUID(user.id), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update profile');
      }
      setProfile({
        ...profile,
        ...payload,
        user_login_info: newLoginInfo,
      });
      setLoginInfo(newLoginInfo);
      setSuccess('Profile updated successfully!');
      setEditMode(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProfile({
      ...updatedProfile,
      [name]: value,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto size-12 animate-spin text-green-600" />
          <p className="mt-4 text-lg font-medium text-gray-700">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 pt-8">
      <div className="relative mb-8 h-24 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-600">
        <div className="h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
      </div>
      <div className="container mx-auto px-4">
        <div className="relative -mt-32 rounded-lg bg-white p-6 shadow-lg md:p-8">
          <div className="mb-8 flex flex-col items-center border-b border-gray-200 pb-6 md:flex-row md:items-start md:pb-8">
            <div className="relative mb-4 md:mb-0 md:mr-6">
              <div className="relative size-24 overflow-hidden rounded-full border-4 border-white shadow-md">
                {profile?.avatar_url ? (
                  <Image 
                    src={profile.avatar_url} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-green-100 text-green-600">
                    <User className="size-12" />
                  </div>
                )}
              </div>
              <button type='button' className="absolute bottom-0 right-0 rounded-full bg-green-600 p-1.5 text-white shadow-md hover:bg-green-700">
                <Camera className="size-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-900">{profile?.full_name || 'User'}</h1>
              <p className="text-gray-600">{profile?.email || ''}</p>
              <p className="mt-1 text-sm text-gray-500">
                Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''}
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <button 
                  type='button'
                  onClick={handleSignOut}
                  className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <LogOut className="mr-1.5 size-4 text-gray-500" />
                  Sign Out
                </button>
                <Link 
                  href="/account/settings" 
                  className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Settings className="mr-1.5 size-4 text-gray-500" />
                  Settings
                </Link>
              </div>
            </div>
          </div>
          {/* Modular Profile Info Form */}
          <ProfileInfoForm
            profile={profile}
            updatedProfile={updatedProfile}
            onChange={handleInputChange}
            onSave={handleProfileUpdate}
            saving={saving}
            editMode={editMode}
            setEditMode={setEditMode}
            error={error}
            success={success}
            element_unique_id={element_unique_id}
          />
          {/* Vendor Registration Section */}
          <div className="mt-10">
            {vendorStatus === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="mb-2 size-8 animate-spin text-green-600" />
                <span className="text-gray-600 font-medium">Checking vendor status...</span>
              </div>
            )}
            {vendorStatus === 'error' && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-6 text-center">
                <AlertCircle className="mx-auto mb-2 size-6 text-red-500" />
                <div className="text-red-700 font-semibold">{vendorError}</div>
                <button
                  className="mt-4 rounded bg-green-600 px-4 py-2 text-white font-medium hover:bg-green-700"
                  onClick={() => setVendorStatus('loading')}
                >
                  Retry
                </button>
              </div>
            )}
            {vendorStatus === 'is_vendor' && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-6 flex flex-col items-center text-center">
                <Store className="mb-2 size-10 text-green-600" />
                <h3 className="text-xl font-bold text-green-800 mb-2">You are a registered vendor!</h3>
                <p className="text-gray-700 mb-4">Manage your products, orders, and more in your vendor dashboard.</p>
                <Link
                  href="/vendor/dashboard"
                  className="rounded bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700 transition"
                >
                  Go to Vendor Dashboard
                </Link>
              </div>
            )}
            {vendorStatus === 'not_vendor' && (
              <div className="rounded-lg bg-gradient-to-br from-green-100 via-white to-green-50 border border-green-200 p-6 flex flex-col items-center text-center">
                <ShoppingBag className="mb-2 size-10 text-green-500" />
                <h3 className="text-xl font-bold text-green-800 mb-2">Become a Vendor on PlantoMart!</h3>
                <p className="text-gray-700 mb-4 max-w-xl">Unlock your own storefront, reach thousands of plant lovers, and grow your business with us. Click below to start your vendor journey.</p>
                <button
                  className="rounded bg-green-600 px-6 py-2 text-white font-semibold hover:bg-green-700 transition mb-2"
                  onClick={() => setVendorStatus('registering')}
                >
                  Register as Vendor
                </button>
              </div>
            )}
            {vendorStatus === 'registering' && (
              <div className="w-full flex flex-col items-center">
                <VendorRegister 
                  userUUID={user?.id}
                  userEmail={user?.email}
                  userName={profile?.full_name}
                  onRegistrationSuccess={() => {
                    setVendorStatus('is_vendor');
                    // Refresh vendor status after successful registration
                    setTimeout(() => {
                      setVendorStatus('loading');
                      // Re-check vendor status
                      fetchUserData();
                    }, 2000);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-12 h-1 w-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
    </div>
  );
}