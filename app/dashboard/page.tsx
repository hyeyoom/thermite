import { redirect } from 'next/navigation'
import { format } from 'date-fns'

export default function DashboardPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  redirect(`/dashboard/${today}`)
} 