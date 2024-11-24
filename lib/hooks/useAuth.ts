import { signOutServerAction } from '@/app/actions/auth.actions'

export function useAuth() {
  const signOut = async () => {
    await signOutServerAction()
  }

  return { signOut }
} 