/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/utils/supabase/client';

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

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [message, setMessage] = useState('Processing login...')
  const [ipInfo, setIpInfo] = useState<GeoLocation | null>(null)

  // Function to get the user's IP address and geolocation
  const getIpAndLocation = async (): Promise<GeoLocation | null> => {
    try {
      // First get the IP address
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      const ip = ipData.ip;
      
      // Then get geolocation data
      const geoResponse = await fetch(`https://ipinfo.io/${ip}/json?token=db04343f368c67`);
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
  
  useEffect(() => {
    const handleAuth = async () => {
      // Get IP and location information
      const locationInfo = await getIpAndLocation();
      setIpInfo(locationInfo);
      
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Check if user already has a profile
          const { data: existingProfile, error: profileError } = await supabase
            .from('profiles_dev')
            .select('*')
            .eq('uuid', session.user.id)
            .single()

          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error checking profile:', profileError)
          }

          // If profile doesn't exist, create one
          if (!existingProfile) {
            setMessage('Setting up your account...')
            const { error: insertError } = await supabase
              .from('profiles_dev')
              .insert({
                uuid: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                email: session.user.email || '',
                phone: session.user.user_metadata?.phone || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                user_login_info: {
                  last_sign_in: new Date().toISOString(),
                  sign_in_count: 1,
                  sign_in_method: 'google',
                  provider: 'google',
                  ip_address: locationInfo?.ip || 'unknown',
                  location: locationInfo ? {
                    city: locationInfo.city || 'unknown',
                    region: locationInfo.region || 'unknown',
                    country: locationInfo.country || 'unknown',
                    coordinates: locationInfo.loc || 'unknown',
                    timezone: locationInfo.timezone || 'unknown'
                  } : 'unknown'
                }
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
            }
          } else {
            // Update existing profile with login information
            setMessage('Updating your account...')
            const currentLoginInfo = existingProfile.user_login_info || {};
            const signInCount = (currentLoginInfo.sign_in_count || 0) + 1;
            
            const { error: updateError } = await supabase
              .from('profiles_dev')
              .update({
                updated_at: new Date().toISOString(),
                // Update avatar_url if it has changed
                avatar_url: session.user.user_metadata?.avatar_url || existingProfile.avatar_url,
                // Update full_name if it has changed
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || existingProfile.full_name,
                user_login_info: {
                  ...currentLoginInfo,
                  last_sign_in: new Date().toISOString(),
                  sign_in_count: signInCount,
                  sign_in_method: 'google',
                  provider: 'google',
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
              .eq('uuid', session.user.id);
            
            if (updateError) {
              console.error('Error updating profile:', updateError);
            }
          }

          // Check if there's a stored redirect URL
          let redirectTo = '/';
          
          // Only run this in the browser environment
          if (typeof window !== 'undefined') {
            const storedRedirectUrl = localStorage.getItem('authRedirectUrl');
            if (storedRedirectUrl) {
              redirectTo = storedRedirectUrl;
              // Clear the stored URL after using it
              localStorage.removeItem('authRedirectUrl');
            }
          }
          
          setMessage(`Redirecting to ${redirectTo}...`);
          router.push(redirectTo);
        } else {
          console.error('Authentication error:', error?.message)
          router.push('/login')
        }
      } catch (err) {
        console.error('Error in auth callback:', err)
        router.push('/login')
      } finally {
        setIsProcessing(false)
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
        <p className="text-lg font-medium">{message}</p>
      </div>
    </div>
  )
}