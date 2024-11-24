'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-6 h-6" />
        <h2 className="text-xl font-semibold">문제가 발생했습니다</h2>
      </div>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )
} 