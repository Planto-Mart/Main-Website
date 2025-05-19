/* eslint-disable no-unused-vars */
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [message, setMessage] = useState('Processing login...')

  useEffect(() => {
    const handleAuth = async () => {
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
            .eq('id', session.user.id)
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
                id: session.user.id,
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
                  provider: 'google'
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
                  provider: 'google'
                }
              })
              .eq('id', session.user.id);
            
            if (updateError) {
              console.error('Error updating profile:', updateError);
            }
          }

          router.push('/')
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
