/* eslint-disable import/no-unresolved */
// app/auth/callback/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { supabase } from '@/utils/supabase/client';

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuth = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (session) {
        router.push('/')
      } else {
        console.error('Authentication error:', error?.message)
        router.push('/login')
      }
    }

    handleAuth()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Processing login...</p>
    </div>
  )
}
