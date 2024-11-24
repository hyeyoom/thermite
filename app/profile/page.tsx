'use client'

import { useAuth } from '@/lib/contexts/auth-context'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return null // 또는 로그인 페이지로 리다이렉트
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-12">
      <Card>
        <CardHeader>
          <CardTitle>프로필</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">
                  {user.user_metadata?.full_name || '이름 없음'}
                </h3>
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">계정 정보</h4>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">가입일</span>
                <span>{new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              {user.last_sign_in_at ? <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">마지막 로그인</span>
                <span>{new Date(user.last_sign_in_at).toLocaleDateString()}</span>
              </div> : null}
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">인증 제공자</span>
                <span className="capitalize">{user.app_metadata.provider}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 