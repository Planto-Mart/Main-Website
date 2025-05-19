/* eslint-disable no-unused-vars */
 
// app/auth/callback/page.tsx
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
            .select('id')
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
              })

            if (insertError) {
              console.error('Error creating profile:', insertError)
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
