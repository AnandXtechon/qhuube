"use client"

import { useAdminStore } from '@/store/userStore'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Admin = () => {
  const router = useRouter()
  const { admin } = useAdminStore()

  useEffect(() => {
    if (!admin?.token || !admin?.email) {
      router.push('/admin-auth/login')
    }
  }, [admin, router])

  return (
    <div>
      <p>{admin?.email}</p>
    </div>
  )
}

export default Admin
