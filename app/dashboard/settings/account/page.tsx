import * as React from 'react'

import { ChangeUsernameForm } from './change-username-form'
import { DeleteUserForm } from './delete-user-form'

import { getUser } from '@/lib/supabase/auth'

export default async function AccountPage() {
  const user = await getUser()

  if (!user) return null

  return (
    <main className="flex-1 overflow-auto p-10 pb-16">
      <div className="space-y-16">
        <ChangeUsernameForm user={user} />
        <DeleteUserForm user={user} />
      </div>
    </main>
  )
}
